using Microsoft.AspNetCore.Mvc;

namespace LendersTitle.UI.Controllers
{
    public class AttendanceCheckInController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/Shared/AttendanceCheckIn/Index.cshtml");
        }
    }
}
