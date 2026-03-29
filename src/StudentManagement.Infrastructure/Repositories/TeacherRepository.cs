using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Abstractions;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Persistence;

namespace StudentManagement.Infrastructure.Repositories;

public sealed class TeacherRepository : ITeacherRepository
{
    private readonly AppDbContext _db;

    public TeacherRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Teacher teacher, CancellationToken cancellationToken = default)
    {
        await _db.Teachers.AddAsync(teacher, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default)
    {
        var n = name.Trim().ToLowerInvariant();
        return await _db.Teachers.AnyAsync(t => t.Name.ToLower() == n, cancellationToken);
    }

    public async Task<Teacher?> GetByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default)
    {
        var n = name.Trim().ToLowerInvariant();
        return await _db.Teachers.FirstOrDefaultAsync(t => t.Name.ToLower() == n, cancellationToken);
    }

    public async Task<(IReadOnlyList<Teacher> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _db.Teachers.AsNoTracking().OrderBy(t => t.Name);
        var total = await query.CountAsync(cancellationToken);
        var skip = (page - 1) * pageSize;
        var items = await query.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }
}
