using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using tiny_haven.Server.Data;
using tiny_haven.Server.Services;

var builder = WebApplication.CreateBuilder(args);

var connectonString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite(connectonString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<MaterialService>();
builder.Services.AddTransient<MapSeederService>();
builder.Services.AddScoped<ICollisionMap, CollisionMap>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<MapSeederService>();
    await seeder.SeedMapAsync();

    var materials = scope.ServiceProvider.GetRequiredService<MaterialService>();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();