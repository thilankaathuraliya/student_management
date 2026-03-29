using Microsoft.Extensions.DependencyInjection;
using StudentManagement.Application.Services;

namespace StudentManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ISubjectService, SubjectService>();
        services.AddScoped<ITeacherService, TeacherService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
