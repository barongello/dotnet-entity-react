using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseInMemoryDatabase("TodoDB")
);

var app = builder.Build();

app.UseForwardedHeaders(
    new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    }
);

app.UsePathBase("/dotnet-entity-react");
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.MapGet(
    "/api/todos",
    async (AppDbContext db) => await db.Todos.ToListAsync()
);

app.MapPost(
    "/api/todos",
    async (TodoItem item, AppDbContext db) =>
    {
        db.Todos.Add(item);

        await db.SaveChangesAsync();

        return Results.Created($"/api/todos/{item.Id}", item);
    }
);

app.MapPut(
    "/api/todos/{id}",
    async (int id, TodoItem inputItem, AppDbContext db) =>
    {
        var todo = await db.Todos.FindAsync(id);

        if (todo is null)
        {
            return Results.NotFound();
        }

        todo.Title = inputItem.Title;
        todo.IsComplete = inputItem.IsComplete;

        await db.SaveChangesAsync();

        return Results.NoContent();
    }
);

app.MapPatch(
    "/api/todos/{id}",
    async (int id, TodoItem inputItem, AppDbContext db) =>
    {
        var todo = await db.Todos.FindAsync(id);

        if (todo is null)
        {
            return Results.NotFound();
        }

        if (!string.IsNullOrEmpty(inputItem.Title))
        {
            todo.Title = inputItem.Title;
        }

        todo.IsComplete = inputItem.IsComplete == true;

        await db.SaveChangesAsync();

        return Results.Ok(todo);
    }
);

app.MapDelete(
    "/api/todos/{id}",
    async (int id, AppDbContext db) =>
    {
        var todo = await db.Todos.FindAsync(id);

        if (todo is null)
        {
            return Results.NotFound();
        }

        db.Todos.Remove(todo);

        await db.SaveChangesAsync();

        return Results.NoContent();
    }
);

app.MapDelete(
    "/api/todos/clear-all",
    async (AppDbContext db) =>
    {
        db.Todos.RemoveRange(db.Todos);

        await db.SaveChangesAsync();

        return Results.NoContent();
    }
);

app.MapFallbackToFile("index.html");

app.Run();
