using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Application.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class TeachersController : ControllerBase
{
    private readonly ITeacherService _teachers;

    public TeachersController(ITeacherService teachers)
    {
        _teachers = teachers;
    }

    [HttpPost]
    public async Task<ActionResult<TeacherDto>> Create([FromBody] CreateTeacherRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _teachers.CreateAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<TeacherDto>>> GetPaged([FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken cancellationToken)
    {
        var p = page ?? PaginationConstants.DefaultPage;
        var ps = pageSize ?? PaginationConstants.DefaultPageSize;
        var result = await _teachers.GetPagedAsync(p, ps, cancellationToken);
        return Ok(result);
    }
}
