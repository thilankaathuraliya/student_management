using StudentManagement.Application.Abstractions;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public sealed class TeacherService : ITeacherService
{
    private readonly ITeacherRepository _teachers;

    public TeacherService(ITeacherRepository teachers)
    {
        _teachers = teachers;
    }

    public async Task<TeacherDto> CreateAsync(CreateTeacherRequest request, CancellationToken cancellationToken = default)
    {
        var name = request.Name.Trim();
        if (string.IsNullOrEmpty(name))
            throw new ArgumentException("Name is required.", nameof(request));

        if (await _teachers.ExistsByNameIgnoreCaseAsync(name, cancellationToken))
            throw new InvalidOperationException("A teacher with this name already exists.");

        var entity = new Teacher
        {
            Id = Guid.NewGuid(),
            Name = name,
        };
        await _teachers.AddAsync(entity, cancellationToken);
        return new TeacherDto(entity.Id, entity.Name);
    }

    public async Task<PagedResult<TeacherDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var (p, ps) = PaginationConstants.Normalize(page, pageSize);
        var (items, total) = await _teachers.GetPagedAsync(p, ps, cancellationToken);
        var dtos = items.Select(t => new TeacherDto(t.Id, t.Name)).ToList();
        return new PagedResult<TeacherDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = p,
            PageSize = ps,
        };
    }
}
