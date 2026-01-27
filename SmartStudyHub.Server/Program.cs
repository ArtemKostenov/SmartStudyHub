using Microsoft.EntityFrameworkCore;
using SmartStudyHub.Server.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();

builder.Services.AddCors(options =>
{
   options.AddPolicy("AllowReactApp", policy =>
   {
      policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod(); 
   }); 
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.Run();
