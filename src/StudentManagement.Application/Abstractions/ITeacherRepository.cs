using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Abstractions;

public interface ITeacherRepository
{
    Task AddAsync(Teacher teacher, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default);
    Task<Teacher?> GetByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Teacher> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
