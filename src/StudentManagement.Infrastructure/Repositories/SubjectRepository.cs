using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Abstractions;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Persistence;

namespace StudentManagement.Infrastructure.Repositories;

public sealed class SubjectRepository : ISubjectRepository
{
    private readonly AppDbContext _db;

    public SubjectRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Subject subject, CancellationToken cancellationToken = default)
    {
        await _db.Subjects.AddAsync(subject, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default)
    {
        var n = name.Trim().ToLowerInvariant();
        return await _db.Subjects.AnyAsync(s => s.Name.ToLower() == n, cancellationToken);
    }

    public async Task<Subject?> GetByNameIgnoreCaseAsync(string name, CancellationToken cancellationToken = default)
    {
        var n = name.Trim().ToLowerInvariant();
        return await _db.Subjects.FirstOrDefaultAsync(s => s.Name.ToLower() == n, cancellationToken);
    }

    public async Task<(IReadOnlyList<Subject> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _db.Subjects.AsNoTracking().OrderBy(s => s.Name);
        var total = await query.CountAsync(cancellationToken);
        var skip = (page - 1) * pageSize;
        var items = await query.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }
}
