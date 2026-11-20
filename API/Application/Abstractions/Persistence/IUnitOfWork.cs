namespace Application.Abstractions.Persistence;

public interface IUnitOfWork
{
    ICategoryRepository Categories { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
