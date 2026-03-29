using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;

namespace StudentManagement.Application.Services;

public interface ITeacherService
{
    Task<TeacherDto> CreateAsync(CreateTeacherRequest request, CancellationToken cancellationToken = default);
    Task<PagedResult<TeacherDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
