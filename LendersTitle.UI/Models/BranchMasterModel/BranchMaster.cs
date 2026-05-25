using System.ComponentModel.DataAnnotations;

namespace LendersTitle.UI.Models.BranchMasterModel
{
    public class BranchMasterPostModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Branch name is required")]
        [StringLength(100, ErrorMessage = "Branch name cannot exceed 100 characters")]
        [Display(Name = "Branch Name")]
        public string BranchName { get; set; } = string.Empty;

        [Display(Name = "Status")]
        public bool IsActive { get; set; } = true;
    }

    public class BranchMasterGetModel
    {
        public int Id { get; set; }
        public string BranchName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
    public class BranchListViewModel
    {
        public List<BranchMasterGetModel> Branches { get; set; } = new();
        public int TotalCount { get; set; }
        public int ActiveCount { get; set; }
        public int InactiveCount { get; set; }
    }
}
