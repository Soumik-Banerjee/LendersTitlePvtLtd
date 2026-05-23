using Microsoft.AspNetCore.Mvc;

namespace LendersTitle.UI.Controllers
{
    public class LoginController : Controller
    {
        private static readonly (string Email, string Password, string Name, string Role)[] DemoUsers = new[]
        {
            ("admin@lenderstitle.com", "Admin@123", "Admin User", "Admin"),
            ("employee@lenderstitle.com", "Employee@123", "John Doe", "Employee")
        };

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(string email, string password, bool rememberMe)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                ViewBag.Error = "Email and password are required.";
                return View();
            }

            var user = DemoUsers.FirstOrDefault(u =>
                u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase) &&
                u.Password == password);

            if (user == default)
            {
                ViewBag.Error = "Invalid email or password. Please try again.";
                return View();
            }

            return RedirectToAction("Index", "Home");
        }
    }
}
