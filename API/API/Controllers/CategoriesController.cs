using Application.Categories;
using Application.Categories.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public sealed class CategoriesController(CategoryService categories) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = "Permission:categories.read")]
    public async Task<IActionResult> List(CancellationToken cancellationToken, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try { return Ok(await categories.ListAsync(page, pageSize, cancellationToken)); }
        catch (ArgumentException exception) { return InvalidInput(exception); }
    }

    [HttpGet("{id:int}")]
    [Authorize(Policy = "Permission:categories.read")]
    public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
    {
        var category = await categories.GetAsync(id, cancellationToken);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    [Authorize(Policy = "Permission:categories.manage")]
    public async Task<IActionResult> Create(CreateCategoryDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var category = await categories.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
        }
        catch (ArgumentException exception) { return InvalidInput(exception); }
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "Permission:categories.manage")]
    public async Task<IActionResult> Update(int id, UpdateCategoryDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var category = await categories.UpdateAsync(id, dto, cancellationToken);
            return category is null ? NotFound() : Ok(category);
        }
        catch (ArgumentException exception) { return InvalidInput(exception); }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "Permission:categories.manage")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) =>
        await categories.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();

    private ObjectResult InvalidInput(ArgumentException exception) =>
        Problem(statusCode: StatusCodes.Status400BadRequest, title: "Invalid category request", detail: exception.Message);
}
