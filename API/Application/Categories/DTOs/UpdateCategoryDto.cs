using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Categories.DTOs;

public sealed record UpdateCategoryDto(
    [Required, StringLength(Category.MaxNameLength)] string Name,
    [StringLength(Category.MaxDescriptionLength)] string? Description);
