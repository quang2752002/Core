using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Categories.DTOs;

public sealed record CreateCategoryDto(
    [Required, StringLength(Category.MaxNameLength)] string Name,
    [StringLength(Category.MaxDescriptionLength)] string? Description);
