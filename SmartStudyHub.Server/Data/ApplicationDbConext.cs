using Microsoft.EntityFrameworkCore;
using SmartStudyHub.Server.Models;

namespace SmartStudyHub.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}

    public DbSet<User> Users { get; set; }
    public DbSet<Note> Notes { get; set; } 
    
}