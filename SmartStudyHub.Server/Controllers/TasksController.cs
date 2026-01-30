using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyHub.Server.Data;
using SmartStudyHub.Server.DTOs;
using SmartStudyHub.Server.Models;
using System.Security.Claims;

namespace SmartStudyHub.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    //GET: api/tasks (получить все задания)
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetAllTasks()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tasks = await _context.Tasks.AsNoTracking().Where(t => t.UserId == userId).OrderByDescending(t => t.CreatedAt).ToListAsync();

        var response = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            DueDate = t.DueDate
        }).ToList();

        return Ok(response);
    }

    //POST: api/tasks (создать задачу)
    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var newTask = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            UserId = userId,
            Status = TaskStatusEnum.NotStarted,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (request.DueDate.HasValue)
        {
            newTask.DueDate = DateTime.SpecifyKind(request.DueDate.Value, DateTimeKind.Utc);
        }

        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        return Ok(new TaskDto
        {
            Id = newTask.Id,
            Title = newTask.Title,
            Description = newTask.Description,
            Status = newTask.Status,
            CreatedAt = newTask.CreatedAt,
            DueDate = newTask.DueDate
        });
    }

    //PATCH api/tasks/{id}/status (обновить статус задачи)
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
        {
            return NotFound("Задача не найдена");
        }

        task.Status = request.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(
            new
            {
                message = "Статус обновлен"
            }
        );
    }

    //DELETE: api/tasks/{id} (удалить задачу)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task == null)
        {
            return NotFound("Задача не найдена");
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}