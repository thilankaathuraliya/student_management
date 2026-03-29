using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.Common;
using StudentManagement.Application.Dtos;
using StudentManagement.Application.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class SubjectsController : ControllerBase
{
    private readonly ISubjectService _subjects;

    public SubjectsController(ISubjectService subjects)
    {
        _subjects = subjects;
    }

    [HttpPost]
    public async Task<ActionResult<SubjectDto>> Create([FromBody] CreateSubjectRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _subjects.CreateAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<SubjectDto>>> GetPaged([FromQuery] int? page, [FromQuery] int? pageSize, CancellationToken cancellationToken)
    {
        var p = page ?? PaginationConstants.DefaultPage;
        var ps = pageSize ?? PaginationConstants.DefaultPageSize;
        var result = await _subjects.GetPagedAsync(p, ps, cancellationToken);
        return Ok(result);
    }
}
