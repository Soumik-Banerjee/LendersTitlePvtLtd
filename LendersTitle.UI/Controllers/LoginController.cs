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
        var userAgent = Request.Headers["User-Agent"].ToString();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var (browserName, osName, deviceType) = ParseUserAgent(userAgent);

        await _sessionRepo.CreateSessionAsync(new UserSessionDto
        {
            SessionId = sessionId,
            UserName = user.UserName,
            FullName = user.FullName,
            LoginAt = DateTime.Now,
            LastActivityAt = DateTime.Now,
            AbsoluteExpiryAt = DateTime.Now.AddHours(8),
            DeviceInfo = userAgent,
            IPAddress = ipAddress,
            IsActive = true,
            BrowserName = browserName,
            OSName = osName,
            DeviceType = deviceType
        });

        var claims = new[]
        {
            new Claim("SessionId", sessionId),
            new Claim("AuthTime", DateTime.Now.ToString("o")),
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

    private static (string? browser, string? os, string? deviceType) ParseUserAgent(string userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return (null, null, null);

        string? browser = null;
        string? os = null;
        string? deviceType = "Desktop";

        if (userAgent.Contains("Edg", StringComparison.OrdinalIgnoreCase))
            browser = "Edge";
        else if (userAgent.Contains("Chrome", StringComparison.OrdinalIgnoreCase))
            browser = "Chrome";
        else if (userAgent.Contains("Firefox", StringComparison.OrdinalIgnoreCase))
            browser = "Firefox";
        else if (userAgent.Contains("Safari", StringComparison.OrdinalIgnoreCase))
            browser = "Safari";
        else if (userAgent.Contains("MSIE", StringComparison.OrdinalIgnoreCase) || userAgent.Contains("Trident", StringComparison.OrdinalIgnoreCase))
            browser = "Internet Explorer";

        if (userAgent.Contains("Windows NT", StringComparison.OrdinalIgnoreCase))
            os = "Windows";
        else if (userAgent.Contains("Mac OS X", StringComparison.OrdinalIgnoreCase))
            os = "macOS";
        else if (userAgent.Contains("Linux", StringComparison.OrdinalIgnoreCase) && !userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase))
            os = "Linux";
        else if (userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase))
        {
            os = "Android";
            deviceType = "Mobile";
        }
        else if (userAgent.Contains("iPhone", StringComparison.OrdinalIgnoreCase) || userAgent.Contains("iPad", StringComparison.OrdinalIgnoreCase))
        {
            os = "iOS";
            deviceType = userAgent.Contains("iPad", StringComparison.OrdinalIgnoreCase) ? "Tablet" : "Mobile";
        }

        if (userAgent.Contains("Mobile", StringComparison.OrdinalIgnoreCase) && deviceType == "Desktop")
            deviceType = "Mobile";
        else if (userAgent.Contains("Tablet", StringComparison.OrdinalIgnoreCase) || userAgent.Contains("iPad", StringComparison.OrdinalIgnoreCase))
            deviceType = "Tablet";

        return (browser, os, deviceType);
    }
}
