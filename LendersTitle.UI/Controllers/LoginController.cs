using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Models.Auth;
using System.Security.Claims;

namespace LendersTitle.UI.Controllers;

public class LoginController : Controller
{
    private readonly IAuthServiceInterface _authService;
    private readonly IUserSessionRepository _sessionRepo;

    public LoginController(IAuthServiceInterface authService, IUserSessionRepository sessionRepo)
    {
        _authService = authService;
        _sessionRepo = sessionRepo;
    }

    [HttpGet]
    public IActionResult Index()
    {
        if (User.Identity?.IsAuthenticated == true)
            return RedirectToAction("Index", "Home");
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Index(LoginViewModel model)
    {
        if (!ModelState.IsValid)
        {
            ViewBag.Error = "Please enter valid credentials.";
            return View(model);
        }

        var user = await _authService.ValidateUserAsync(model.Email, model.Password);
        if (user == null)
        {
            ViewBag.Error = "Invalid email or password. Please try again.";
            return View(model);
        }

        var sessionId = Guid.NewGuid().ToString();
        var deviceInfo = Request.Headers["User-Agent"].ToString();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        await _sessionRepo.CreateSessionAsync(new UserSessionDto
        {
            SessionId = sessionId,
            UserName = user.UserName,
            FullName = user.FullName,
            LoginAt = DateTime.UtcNow,
            LastActivityAt = DateTime.UtcNow,
            AbsoluteExpiryAt = DateTime.UtcNow.AddHours(8),
            DeviceInfo = deviceInfo,
            IPAddress = ipAddress,
            IsActive = true
        });

        var claims = new[]
        {
            new Claim("SessionId", sessionId),
            new Claim("AuthTime", DateTime.UtcNow.ToString("o")),
            new Claim(ClaimTypes.NameIdentifier, user.AutoId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim("FullName", user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("Branch", user.Branch)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(principal);

        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        var sessionId = User.FindFirst("SessionId")?.Value;
        if (sessionId != null)
            await _sessionRepo.RevokeSessionAsync(sessionId);

        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return RedirectToAction("Index");
    }
}
