using SmartStudyHub.Server.Models;

namespace SmartStudyHub.Server.DTOs;

public class UpdateTaskStatusRequest
{
    public TaskStatusEnum Status { get; set; }
}