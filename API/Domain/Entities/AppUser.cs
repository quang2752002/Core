namespace Domain.Entities;

public sealed record AppUser(int Id, string UserName, string PasswordHash, IReadOnlyCollection<string> Roles, IReadOnlyCollection<string> Permissions);
