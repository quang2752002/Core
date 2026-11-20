using Application.Authentication;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Authentication;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly AppUser _admin;
    private readonly AppUser _user;

    public InMemoryUserRepository(IPasswordHasher<AppUser> hasher)
    {
        _admin = Create(hasher, 1, "admin", "ChangeMe123!", ["Admin"], ["weather.read", "weather.manage", "categories.read", "categories.manage"]);
        _user = Create(hasher, 2, "user", "ChangeMe123!", ["User"], ["weather.read", "categories.read"]);
    }

    public Task<AppUser?> FindByUserNameAsync(string userName, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(new[] { _admin, _user }.FirstOrDefault(x => x.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase)));
    }

    private static AppUser Create(IPasswordHasher<AppUser> hasher, int id, string name, string password, string[] roles, string[] permissions)
    {
        var user = new AppUser(id, name, string.Empty, roles, permissions);
        return user with { PasswordHash = hasher.HashPassword(user, password) };
    }
}
