using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Abstractions;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Persistence;

namespace StudentManagement.Infrastructure.Repositories;

public sealed class AdminUserRepository : IAdminUserRepository
{
    private readonly AppDbContext _db;

    public AdminUserRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(AdminUser user, CancellationToken cancellationToken = default)
    {
        await _db.AdminUsers.AddAsync(user, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
    {
        return await _db.AdminUsers.AnyAsync(cancellationToken);
    }

    public async Task<AdminUser?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        var u = username.Trim().ToLowerInvariant();
        return await _db.AdminUsers.FirstOrDefaultAsync(a => a.Username.ToLower() == u, cancellationToken);
    }
}
