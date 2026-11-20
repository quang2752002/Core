using Application.Abstractions.Persistence;
using Application.Categories.DTOs;
using MapsterMapper;
using Domain.Entities;

namespace Application.Categories;

public sealed class CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
{
    public async Task<IReadOnlyList<CategoryDto>> ListAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        if (page < 1 || page > 1_000_000 || pageSize < 1 || pageSize > 100)
            throw new ArgumentException("Page must be between 1 and 1000000; pageSize must be between 1 and 100.");
        var categories = await unitOfWork.Categories.ListAsync(page, pageSize, cancellationToken);
        return mapper.Map<CategoryDto[]>(categories);
    }

    public async Task<CategoryDto?> GetAsync(int id, CancellationToken cancellationToken)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        return category is null ? null : mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken)
    {
        var category = mapper.Map<Category>(dto);
        unitOfWork.Categories.Add(category);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto, CancellationToken cancellationToken)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        if (category is null) return null;
        mapper.Map(dto, category);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return mapper.Map<CategoryDto>(category);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var category = await unitOfWork.Categories.GetByIdAsync(id, cancellationToken);
        if (category is null) return false;
        unitOfWork.Categories.Remove(category);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
