using LendersTitle.UI.Data;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Repositories;
using LendersTitle.UI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddControllersWithViews();

// Data Protection — persist keys to SQL Server (survives app pool recycle)
builder.Services.AddDataProtection()
    .PersistKeysToDbContext<AppDbContext>()
    .SetApplicationName("LendersTitle");

// Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login/Index";
        options.LogoutPath = "/Login/Logout";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
        options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Events = new CookieAuthenticationEvents
        {
            OnValidatePrincipal = async context =>
            {
                var sessionRepo = context.HttpContext.RequestServices
                    .GetRequiredService<IUserSessionRepository>();
                var sessionId = context.Principal?.FindFirst("SessionId")?.Value;

                if (sessionId != null)
                {
                    var valid = await sessionRepo.IsSessionActiveAsync(sessionId);
                    if (!valid)
                    {
                        context.RejectPrincipal();
                        await context.HttpContext.SignOutAsync();
                        return;
                    }
                    await sessionRepo.DeleteOldSessionsAsync(sessionId);
                    await sessionRepo.UpdateActivityAsync(sessionId);
                }

                var authTime = context.Principal?.FindFirst("AuthTime")?.Value;
                if (authTime != null && DateTime.TryParse(authTime, out var loginTime))
                {
                    if (DateTime.Now - loginTime.ToUniversalTime() > TimeSpan.FromHours(8))
                    {
                        if (sessionId != null)
                            await sessionRepo.RevokeSessionAsync(sessionId);
                        context.RejectPrincipal();
                        await context.HttpContext.SignOutAsync();
                    }
                }
            }
        };
    });

// Register application services — Auth
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserSessionRepository, UserSessionRepository>();
builder.Services.AddScoped<IAuthServiceInterface, AuthService>();

// Register application services — Business
builder.Services.AddScoped<BranchMasterRepoInterface, BranchMasterRepository>();
builder.Services.AddScoped<BranchMasterServiceInterface, BranchMasterService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
