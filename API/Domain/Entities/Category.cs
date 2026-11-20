using Domain.Common;

namespace Domain.Entities;

public sealed class Category : BaseEntity
{
    public const int MaxNameLength = 200;
    public const int MaxDescriptionLength = 2000;

    // Required by EF Core.
    private Category() { }

    public Category(string name, string? description = null)
    {
        SetDetails(name, description);
    }

    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    public void Update(string name, string? description)
    {
        SetDetails(name, description);
        MarkUpdated();
    }

    private void SetDetails(string name, string? description)
    {
        var trimmedName = name?.Trim();
        var trimmedDescription = description?.Trim();
        if (string.IsNullOrWhiteSpace(trimmedName) || trimmedName.Length > MaxNameLength)
            throw new ArgumentException($"Name must contain 1 to {MaxNameLength} characters.", nameof(name));
        if (trimmedDescription?.Length > MaxDescriptionLength)
            throw new ArgumentException($"Description must not exceed {MaxDescriptionLength} characters.", nameof(description));

        Name = trimmedName;
        Description = string.IsNullOrEmpty(trimmedDescription) ? null : trimmedDescription;
    }
}
