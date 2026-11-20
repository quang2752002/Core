using Application.Authentication;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Authentication;

public sealed class PasswordVerifier(IPasswordHasher<AppUser> hasher) : IPasswordVerifier
{
    public bool Verify(AppUser user, string password) => hasher.VerifyHashedPassword(user, user.PasswordHash, password) != PasswordVerificationResult.Failed;
}
