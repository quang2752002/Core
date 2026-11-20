using System.Security.Claims;
using System.Text;
using Application.Authentication;
using Application.Abstractions.Persistence;
using Application.Categories;
using Application.Categories.Mappings;
using Domain.Entities;
using Infrastructure.Authentication;
using Infrastructure.Persistence;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Mapster;
using MapsterMapper;

var builder = WebApplication.CreateBuilder(args);
var jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("JWT configuration is missing.");
if (Encoding.UTF8.GetByteCount(jwt.Secret) < 32)
    throw new InvalidOperationException("Jwt:Secret must contain at least 32 bytes. Configure it through user-secrets or environment variables.");

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.AddScoped<LoginService>();
var connectionString = new SqliteConnectionStringBuilder(
    builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=core.db");
if (connectionString.DataSource != ":memory:" && !Path.IsPathRooted(connectionString.DataSource))
    connectionString.DataSource = Path.Combine(builder.Environment.ContentRootPath, connectionString.DataSource);
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString.ToString()));
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<CategoryService>();
var mappingConfig = new TypeAdapterConfig();
mappingConfig.Scan(typeof(CategoryMappingConfig).Assembly);
mappingConfig.Compile();
builder.Services.AddSingleton(mappingConfig);
builder.Services.AddScoped<IMapper, Mapper>();
builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
builder.Services.AddSingleton<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
builder.Services.AddSingleton<IPasswordVerifier, PasswordVerifier>();
builder.Services.AddSingleton<ITokenIssuer, JwtTokenIssuer>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, ValidIssuer = jwt.Issuer,
        ValidateAudience = true, ValidAudience = jwt.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)),
        ValidateLifetime = true, ClockSkew = TimeSpan.FromSeconds(30),
        NameClaimType = ClaimTypes.Name, RoleClaimType = ClaimTypes.Role
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Permission:categories.read", policy => policy.RequireAuthenticatedUser().RequireClaim("permission", "categories.read"));
    options.AddPolicy("Permission:categories.manage", policy => policy.RequireAuthenticatedUser().RequireClaim("permission", "categories.manage"));
    options.AddPolicy("Permission:weather.read", policy => policy.RequireAuthenticatedUser().RequireClaim("permission", "weather.read"));
    options.AddPolicy("Permission:weather.manage", policy => policy.RequireAuthenticatedUser().RequireClaim("permission", "weather.manage"));
    options.AddPolicy("Role:Admin", policy => policy.RequireAuthenticatedUser().RequireRole("Admin"));
});

var app = builder.Build();
// Initial scaffold schema; use migrations when evolving an existing database.
using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreatedAsync();
}
if (app.Environment.IsDevelopment()) app.MapOpenApi();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
