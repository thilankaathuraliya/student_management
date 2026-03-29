using StudentManagement.Application.Abstractions;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public sealed class SubjectService : ISubjectService
{
    private readonly ISubjectRepository _subjects;

    public SubjectService(ISubjectRepository subjects)
    {
        _subjects = subjects;
    }

    public async Task<SubjectDto> CreateAsync(CreateSubjectRequest request, CancellationToken cancellationToken = default)
    {
        var name = request.Name.Trim();
        if (string.IsNullOrEmpty(name))
            throw new ArgumentException("Name is required.", nameof(request));

        if (await _subjects.ExistsByNameIgnoreCaseAsync(name, cancellationToken))
            throw new InvalidOperationException("A subject with this name already exists.");

        var entity = new Subject
        {
            Id = Guid.NewGuid(),
            Name = name,
        };
        await _subjects.AddAsync(entity, cancellationToken);
        return new SubjectDto(entity.Id, entity.Name);
    }

    public async Task<PagedResult<SubjectDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var (p, ps) = PaginationConstants.Normalize(page, pageSize);
        var (items, total) = await _subjects.GetPagedAsync(p, ps, cancellationToken);
        var dtos = items.Select(s => new SubjectDto(s.Id, s.Name)).ToList();
        return new PagedResult<SubjectDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = p,
            PageSize = ps,
        };
    }
}
