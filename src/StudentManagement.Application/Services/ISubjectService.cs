using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;

namespace StudentManagement.Application.Services;

public interface ISubjectService
{
    Task<SubjectDto> CreateAsync(CreateSubjectRequest request, CancellationToken cancellationToken = default);
    Task<PagedResult<SubjectDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
