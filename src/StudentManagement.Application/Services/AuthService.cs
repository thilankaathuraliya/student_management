using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StudentManagement.Application.Abstractions;
using StudentManagement.Application.Configuration;
using StudentManagement.Application.Dtos;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IAdminUserRepository _adminUsers;
    private readonly IJwtTokenProvider _jwt;
    private readonly IPasswordHasher<AdminUser> _passwordHasher;
    private readonly int _expiresInSeconds;

    public AuthService(
        IAdminUserRepository adminUsers,
        IJwtTokenProvider jwt,
        IPasswordHasher<AdminUser> passwordHasher,
        IOptions<JwtOptions> jwtOptions)
    {
        _adminUsers = adminUsers;
        _jwt = jwt;
        _passwordHasher = passwordHasher;
        _expiresInSeconds = (int)TimeSpan.FromMinutes(Math.Max(1, jwtOptions.Value.ExpiresInMinutes)).TotalSeconds;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _adminUsers.GetByUsernameAsync(request.Username.Trim(), cancellationToken);
        if (user is null)
            return null;

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return null;

        var token = _jwt.CreateToken(user.Id, user.Username);
        return new LoginResponse(token, _expiresInSeconds);
    }
}
