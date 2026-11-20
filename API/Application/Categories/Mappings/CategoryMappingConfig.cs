using Application.Categories.DTOs;
using Domain.Entities;
using Mapster;

namespace Application.Categories.Mappings;

public sealed class CategoryMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Category, CategoryDto>().MapToConstructor(true);

        // Domain methods retain validation, normalization, and audit timestamps.
        config.NewConfig<CreateCategoryDto, Category>()
            .MapWith(dto => new Category(dto.Name, dto.Description));

        config.NewConfig<UpdateCategoryDto, Category>()
            .MapToTargetWith((dto, category) => ApplyUpdate(dto, category));
    }

    private static Category ApplyUpdate(UpdateCategoryDto dto, Category category)
    {
        category.Update(dto.Name, dto.Description);
        return category;
    }
}
