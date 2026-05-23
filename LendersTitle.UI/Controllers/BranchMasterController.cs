using Microsoft.AspNetCore.Mvc;
using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Controllers
{
    public class BranchMasterController : Controller
    {
        private static readonly List<BranchMaster> Branches = new();
        private static int _nextId = 1;

        public IActionResult Index()
        {
            var vm = new BranchListViewModel
            {
                Branches = Branches.ToList(),
                TotalCount = Branches.Count,
                ActiveCount = Branches.Count(b => b.IsActive),
                InactiveCount = Branches.Count(b => !b.IsActive)
            };
            return View(vm);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new BranchMaster());
        }

        [HttpPost]
        public IActionResult Create(BranchMaster model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.Id = _nextId++;
            Branches.Add(model);

            TempData["Success"] = $"Branch \"{model.BranchName}\" created successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}
