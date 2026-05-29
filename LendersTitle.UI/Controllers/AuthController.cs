using Microsoft.AspNetCore.Mvc;

namespace LendersTitle.UI.Controllers;

public class AuthController : Controller
{
    [HttpGet("/Auth/Ping")]
    public IActionResult Ping()
    {
        return Ok();
    }

    [HttpGet("/Auth/ValidateSession")]
    public IActionResult ValidateSession()
    {
        if (User.Identity?.IsAuthenticated == true)
            return Ok(new { status = "ok" });
        return Unauthorized(new { status = "expired" });
    }
}
