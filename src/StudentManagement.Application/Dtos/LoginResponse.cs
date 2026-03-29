namespace StudentManagement.Application.Dtos;

public sealed record LoginResponse(string Token, int ExpiresInSeconds);
