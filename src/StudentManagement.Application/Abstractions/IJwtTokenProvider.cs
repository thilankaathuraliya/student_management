namespace StudentManagement.Application.Abstractions;

public interface IJwtTokenProvider
{
    string CreateToken(Guid userId, string username);
}
