using Application.Abstractions.Persistence;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public sealed class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task<IReadOnlyList<Category>> ListAsync(int page, int pageSize, CancellationToken cancellationToken = default) =>
        await context.Categories.AsNoTracking().OrderBy(x => x.Name).ThenBy(x => x.Id)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

    public Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        context.Categories.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public void Add(Category category) => context.Categories.Add(category);
    public void Remove(Category category) => context.Categories.Remove(category);
}
