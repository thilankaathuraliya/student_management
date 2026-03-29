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

        if (await adminRepo.AnyAsync(cancellationToken))
            return;

        var user = new AdminUser
        {
            Id = Guid.NewGuid(),
            Username = adminSettings.Username.Trim(),
        };
        user.PasswordHash = passwordHasher.HashPassword(user, adminSettings.Password);
        await adminRepo.AddAsync(user, cancellationToken);
    }
}
