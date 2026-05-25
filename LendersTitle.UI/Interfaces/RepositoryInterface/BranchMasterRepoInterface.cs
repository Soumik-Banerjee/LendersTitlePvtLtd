using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Interfaces.RepositoryInterface
{
    public interface BranchMasterRepoInterface
    {
        Task<List<BranchMasterGetModel>> GetAllAsync();
        Task<BranchMasterGetModel?> GetByIdAsync(int id);
        Task<int> CreateAsync(BranchMasterPostModel model);
        Task<bool> UpdateAsync(BranchMasterPostModel model);
        Task<bool> DeleteAsync(int id);
        Task<bool> IsBranchNameExistsAsync(string branchName, int? excludeId = null);
        Task<int> GetActiveCountAsync();
    }
}
