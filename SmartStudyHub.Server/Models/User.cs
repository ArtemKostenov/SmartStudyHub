namespace SmartStudyHub.Server.Models;

public class User
{
    public int Id {get; set;}
    public string Username {get; set; } = string.Empty;
    public string Email {get; set; } = string.Empty;
    public string PasswordHash {get; set; } = string.Empty;
    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime BirthDate {get; set;}

    // Связи с другими сущностями
    public List<Note> Notes {get; set;} = new();
    public List<TaskItem> Tasks {get; set;} = new();

}