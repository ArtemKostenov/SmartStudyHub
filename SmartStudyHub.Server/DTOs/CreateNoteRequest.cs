namespace SmartStudyHub.Server.DTOs;

public class CreateNoteRequest
{
    public string Title {get; set;} = string.Empty;
    public string Content {get; set;} = string.Empty;

    //Пока заглушка
    public int UserId {get; set;}
}