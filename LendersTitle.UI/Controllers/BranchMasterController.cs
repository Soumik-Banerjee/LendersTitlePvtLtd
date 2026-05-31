using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Controllers
{
    [Authorize]
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
            return View("~/Views/Shared/BranchMaster/Index.cshtml", model);
        }

        [HttpGet]
        public async Task<IActionResult> GetBranchesJson()
        {
            var model = await _service.GetAllAsync();
            var data = model.Branches.Select(b => new
            {
                id = b.Id,
                branchName = b.BranchName,
                isActive = b.IsActive
            });
            return Json(new { data });
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View("~/Views/Shared/BranchMaster/Create.cshtml", new BranchMasterPostModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(BranchMasterPostModel model)
        {
            var isAjax = Request.Headers["X-Requested-With"] == "XMLHttpRequest";

            if (!ModelState.IsValid)
            {
                if (isAjax)
                    return PartialView("~/Views/Shared/BranchMaster/_Form.cshtml", model);
                return View("~/Views/Shared/BranchMaster/Create.cshtml", model);
            }

            var (success, message) = await _service.CreateAsync(model);

            if (success)
            {
                if (isAjax)
                    return Json(new { success = true, message });
                TempData["SuccessMessage"] = message;
                return RedirectToAction(nameof(Index));
            }

            ModelState.AddModelError("", message);
            if (isAjax)
                return PartialView("~/Views/Shared/BranchMaster/_Form.cshtml", model);
            return View("~/Views/Shared/BranchMaster/Create.cshtml", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var isAjax = Request.Headers["X-Requested-With"] == "XMLHttpRequest";
            var (success, message) = await _service.DeleteAsync(id);

            if (isAjax)
            {
                return Json(new { success, message, id });
            }

            if (success)
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = message;
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
