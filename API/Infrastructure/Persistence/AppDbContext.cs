using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var category = modelBuilder.Entity<Category>();
        category.ToTable("Categories");
        category.HasKey(x => x.Id);
        category.Property(x => x.Id).ValueGeneratedOnAdd();
        category.Property(x => x.Name).HasMaxLength(Category.MaxNameLength).IsRequired();
        category.Property(x => x.Description).HasMaxLength(Category.MaxDescriptionLength);
        category.Property(x => x.CreatedAtUtc).IsRequired();
    }
}
