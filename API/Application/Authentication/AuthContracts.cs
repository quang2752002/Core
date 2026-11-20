using Domain.Entities;

namespace Application.Authentication;

public sealed record LoginRequest(string UserName, string Password);
public sealed record AuthResult(string AccessToken, DateTime ExpiresAtUtc, string UserName, IReadOnlyCollection<string> Roles, IReadOnlyCollection<string> Permissions);

public interface IUserRepository
{
    Task<AppUser?> FindByUserNameAsync(string userName, CancellationToken cancellationToken);
}

public interface IPasswordVerifier
{
    bool Verify(AppUser user, string password);
}

public interface ITokenIssuer
{
    AuthResult Issue(AppUser user);
}

public sealed class LoginService(IUserRepository users, IPasswordVerifier passwords, ITokenIssuer tokens)
{
    public async Task<AuthResult?> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await users.FindByUserNameAsync(request.UserName, cancellationToken);
        if (user is null || !passwords.Verify(user, request.Password)) return null;
        return tokens.Issue(user);
    }
}
