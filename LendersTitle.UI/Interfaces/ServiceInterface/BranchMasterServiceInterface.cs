using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Interfaces.ServiceInterface
{
    public interface BranchMasterServiceInterface
    {
        Task<BranchListViewModel> GetAllAsync();
        Task<BranchMasterGetModel?> GetByIdAsync(int id);
        Task<(bool Success, string Message)> CreateAsync(BranchMasterPostModel model);
        Task<(bool Success, string Message)> UpdateAsync(BranchMasterPostModel model);
        Task<(bool Success, string Message)> DeleteAsync(int id);
    }
}
