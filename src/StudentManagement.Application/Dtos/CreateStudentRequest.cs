using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Application.Dtos;

public sealed class CreateStudentRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string SubjectName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TeacherName { get; set; } = string.Empty;
}
