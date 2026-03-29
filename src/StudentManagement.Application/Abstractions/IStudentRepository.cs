using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Abstractions;

public interface IStudentRepository
{
    Task AddAsync(Student student, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Student> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
