using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartStudyHub.Server.Data;
using SmartStudyHub.Server.DTOs;
using SmartStudyHub.Server.Models;

namespace SmartStudyHub.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotesController(ApplicationDbContext context)
    {
        _context = context;
    }

    //GET: api/notes (все заметки)
    [HttpGet]
    public async Task<ActionResult<List<NoteResponse>>> GetAllNotes()
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

        var notes = await _context.Notes.AsNoTracking().Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedAt).ToListAsync();

        var response = notes.Select(n => new NoteResponse
        {
            Id = n.Id,
            Title = n.Title,
            Content = n.Content,
            CreatedAt = n.CreatedAt,
            UpdatedAt = n.UpdatedAt
        }).ToList();

        return Ok(response);
    }

    //GET: api/notes/id (заметка оп id)
    [HttpGet("{id}")]
    public async Task<ActionResult<NoteResponse>> GetNoteById(int id)
    {
        var note = await _context.Notes.FindAsync(id);

        if (note == null)
        {
            return NotFound("Заметка не найдена");
        }

        return Ok(new NoteResponse
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        });
    }

    //POST: api/notes (создать заметку)
    [HttpPost]
    public async Task<ActionResult<NoteResponse>> CreateNote([FromBody] CreateNoteRequest request)
    {
        //Проверка юзера
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized("Вы не авторизованы или пользователь не существует");
        }

        var now = DateTime.UtcNow;

        var newNote = new Note
        {
            Title = request.Title,
            Content = request.Content,
            UserId = userId,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Notes.Add(newNote);
        await _context.SaveChangesAsync();

        var response = new NoteResponse
        {
            Id = newNote.Id,
            Title = newNote.Title,
            Content = newNote.Content,
            CreatedAt = newNote.CreatedAt,
            UpdatedAt = newNote.UpdatedAt
        };

        return CreatedAtAction(nameof(GetNoteById), new { id = newNote.Id }, response);
    }
}