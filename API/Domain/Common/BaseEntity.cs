namespace Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; private set; }
    public DateTime CreatedAtUtc { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; private set; }

    protected void MarkUpdated() => UpdatedAtUtc = DateTime.UtcNow;
}
