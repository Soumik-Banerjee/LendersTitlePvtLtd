using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Controllers
{
    [Authorize(Roles = "Admin")]
    public class BranchMasterController : Controller
    {
        private readonly BranchMasterServiceInterface _service;

        public BranchMasterController(BranchMasterServiceInterface service)
        {
            _service = service;
        }

        public async Task<IActionResult> Index()
        {
            var model = await _service.GetAllAsync();
            return View(model);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new BranchMasterPostModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(BranchMasterPostModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var (success, message) = await _service.CreateAsync(model);

            if (success)
            {
                TempData["SuccessMessage"] = message;
                return RedirectToAction(nameof(Index));
            }

            ModelState.AddModelError("", message);
            return View(model);
        }
    }
}
