using StudentManagement.Application.Abstractions;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public sealed class StudentService : IStudentService
{
    private readonly ISubjectRepository _subjects;
    private readonly ITeacherRepository _teachers;
    private readonly IStudentRepository _students;

    public StudentService(ISubjectRepository subjects, ITeacherRepository teachers, IStudentRepository students)
    {
        _subjects = subjects;
        _teachers = teachers;
        _students = students;
    }

    public async Task<StudentDto> CreateAsync(CreateStudentRequest request, CancellationToken cancellationToken = default)
    {
        var studentName = request.Name.Trim();
        var subjectName = request.SubjectName.Trim();
        var teacherName = request.TeacherName.Trim();

        if (string.IsNullOrEmpty(studentName))
            throw new ArgumentException("Student name is required.", nameof(request));
        if (string.IsNullOrEmpty(subjectName))
            throw new ArgumentException("Subject name is required.", nameof(request));
        if (string.IsNullOrEmpty(teacherName))
            throw new ArgumentException("Teacher name is required.", nameof(request));

        var subject = await _subjects.GetByNameIgnoreCaseAsync(subjectName, cancellationToken);
        if (subject is null)
            throw new KeyNotFoundException($"Subject '{request.SubjectName.Trim()}' was not found.");

        var teacher = await _teachers.GetByNameIgnoreCaseAsync(teacherName, cancellationToken);
        if (teacher is null)
            throw new KeyNotFoundException($"Teacher '{request.TeacherName.Trim()}' was not found.");

        var entity = new Student
        {
            Id = Guid.NewGuid(),
            Name = studentName,
            SubjectId = subject.Id,
            TeacherId = teacher.Id,
        };
        await _students.AddAsync(entity, cancellationToken);

        return new StudentDto(entity.Id, entity.Name, subject.Name, teacher.Name);
    }

    public async Task<PagedResult<StudentDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var (p, ps) = PaginationConstants.Normalize(page, pageSize);
        var (items, total) = await _students.GetPagedAsync(p, ps, cancellationToken);
        var dtos = items.Select(s => new StudentDto(s.Id, s.Name, s.Subject.Name, s.Teacher.Name)).ToList();
        return new PagedResult<StudentDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = p,
            PageSize = ps,
        };
    }
}
