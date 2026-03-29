namespace StudentManagement.Domain.Entities;

public class Teacher
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
