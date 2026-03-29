namespace StudentManagement.Application.Dtos;

public sealed record StudentDto(Guid Id, string Name, string SubjectName, string TeacherName);
