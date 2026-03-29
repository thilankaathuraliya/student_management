using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Abstractions;

public interface ISubjectRepository
{
    Task AddAsync(Subject subject, CancellationToken cancellationToken = default);
    Task<bool> ExistsByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default);
    Task<Subject?> GetByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Subject> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
