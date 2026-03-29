using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentManagement.Application.Abstractions;
using StudentManagement.Application.Configuration;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Persistence;
using StudentManagement.Infrastructure.Repositories;
using StudentManagement.Infrastructure.Security;

namespace StudentManagement.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<Configuration.AdminSettings>(configuration.GetSection(Configuration.AdminSettings.SectionName));

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Data Source=studentmanagement.db";

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<ISubjectRepository, SubjectRepository>();
        services.AddScoped<ITeacherRepository, TeacherRepository>();
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IAdminUserRepository, AdminUserRepository>();
        services.AddSingleton<IJwtTokenProvider, JwtTokenProvider>();
        services.AddSingleton<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();

        return services;
    }
}
