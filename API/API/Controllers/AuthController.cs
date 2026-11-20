using Application.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(LoginService loginService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Username and password are required." });
        var result = await loginService.LoginAsync(request, cancellationToken);
        return result is null ? Unauthorized(new { message = "Invalid username or password." }) : Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new
    {
        UserName = User.Identity?.Name,
        Roles = User.FindAll(System.Security.Claims.ClaimTypes.Role).Select(c => c.Value),
        Permissions = User.FindAll("permission").Select(c => c.Value)
    });
}
