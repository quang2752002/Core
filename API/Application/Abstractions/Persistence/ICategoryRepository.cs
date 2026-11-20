using Domain.Entities;

namespace Application.Abstractions.Persistence;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> ListAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    void Add(Category category);
    void Remove(Category category);
}
