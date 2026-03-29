using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;

namespace StudentManagement.Application.Services;

public interface IStudentService
{
    Task<StudentDto> CreateAsync(CreateStudentRequest request, CancellationToken cancellationToken = default);
    Task<PagedResult<StudentDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
}
