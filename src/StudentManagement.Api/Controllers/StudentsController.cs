using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Application.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class StudentsController : ControllerBase
{
    private readonly IStudentService _students;

    public StudentsController(IStudentService students)
    {
        _students = students;
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> Create([FromBody] CreateStudentRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _students.CreateAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<StudentDto>>> GetPaged([FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken cancellationToken)
    {
        var p = page ?? PaginationConstants.DefaultPage;
        var ps = pageSize ?? PaginationConstants.DefaultPageSize;
        var result = await _students.GetPagedAsync(p, ps, cancellationToken);
        return Ok(result);
    }
}
