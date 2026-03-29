using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Application.Dtos;

public sealed class CreateTeacherRequest
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
}
