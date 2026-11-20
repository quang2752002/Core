namespace Application.Categories.DTOs;

public sealed record CategoryDto(int Id, string Name, string? Description, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);
