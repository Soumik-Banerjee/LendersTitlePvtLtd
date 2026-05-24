using Microsoft.EntityFrameworkCore;
using LendersTitle.UI.Data;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Repositories;
using LendersTitle.UI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register application services
builder.Services.AddScoped<BranchMasterRepoInterface, BranchMasterRepository>();
builder.Services.AddScoped<BranchMasterServiceInterface, BranchMasterService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
