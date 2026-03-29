using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Abstractions;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Persistence;

namespace StudentManagement.Infrastructure.Repositories;

public sealed class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _db;

    public StudentRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken = default)
    {
        await _db.Students.AddAsync(student, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<Student> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _db.Students
            .AsNoTracking()
            .Include(s => s.Subject)
            .Include(s => s.Teacher)
            .OrderBy(s => s.Name);
        var total = await query.CountAsync(cancellationToken);
        var skip = (page - 1) * pageSize;
        var items = await query.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }
}
