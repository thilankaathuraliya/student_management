using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StudentManagement.Application.Abstractions;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Configuration;

namespace StudentManagement.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var adminSettings = scope.ServiceProvider.GetRequiredService<IOptions<AdminSettings>>().Value;
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>();
        var adminRepo = scope.ServiceProvider.GetRequiredService<IAdminUserRepository>();

        await db.Database.MigrateAsync(cancellationToken);

        var username = adminSettings.Username.Trim();
        var user = await adminRepo.GetByUsernameAsync(username, cancellationToken);

        if (user is null)
        {
            user = new AdminUser
            {
                Id = Guid.NewGuid(),
                Username = username,
            };
            user.PasswordHash = passwordHasher.HashPassword(user, adminSettings.Password);
            await adminRepo.AddAsync(user, cancellationToken);
            return;
        }

        var verification = passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            adminSettings.Password);
        if (verification == PasswordVerificationResult.Success)
            return;

        user.PasswordHash = passwordHasher.HashPassword(user, adminSettings.Password);
        db.AdminUsers.Update(user);
        await db.SaveChangesAsync(cancellationToken);
    }
}
