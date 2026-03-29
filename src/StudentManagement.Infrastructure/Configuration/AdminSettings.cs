namespace StudentManagement.Infrastructure.Configuration;

public sealed class AdminSettings
{
    public const string SectionName = "Admin";

    public string Username { get; set; } = "admin";
    public string Password { get; set; } = "admin";
}
