using Application.Abstractions.Persistence;

namespace Infrastructure.Persistence;

// DbContext and repository share the same request scope. The DI container disposes the context.
public sealed class UnitOfWork(AppDbContext context, ICategoryRepository categories) : IUnitOfWork
{
    public ICategoryRepository Categories { get; } = categories;
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
