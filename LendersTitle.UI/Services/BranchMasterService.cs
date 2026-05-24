using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Models.BranchMasterModel;

namespace LendersTitle.UI.Services
{
    public class BranchMasterService : BranchMasterServiceInterface
    {
        private readonly BranchMasterRepoInterface _repository;

        public BranchMasterService(BranchMasterRepoInterface repository)
        {
            _repository = repository;
        }

        public async Task<BranchListViewModel> GetAllAsync()
        {
            var branches = await _repository.GetAllAsync();

            return new BranchListViewModel
            {
                Branches = branches,
                TotalCount = branches.Count,
                ActiveCount = branches.Count(b => b.IsActive),
                InactiveCount = branches.Count(b => !b.IsActive)
            };
        }

        public async Task<BranchMasterGetModel?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<(bool Success, string Message)> CreateAsync(BranchMasterPostModel model)
        {
            var exists = await _repository.IsBranchNameExistsAsync(model.BranchName);
            if (exists)
                return (false, "A branch with this name already exists.");

            var id = await _repository.CreateAsync(model);
            return id > 0
                ? (true, "Branch created successfully.")
                : (false, "Failed to create branch.");
        }

        public async Task<(bool Success, string Message)> UpdateAsync(BranchMasterPostModel model)
        {
            var exists = await _repository.IsBranchNameExistsAsync(model.BranchName, model.Id);
            if (exists)
                return (false, "A branch with this name already exists.");

            var updated = await _repository.UpdateAsync(model);
            return updated
                ? (true, "Branch updated successfully.")
                : (false, "Failed to update branch.");
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            return deleted
                ? (true, "Branch deleted successfully.")
                : (false, "Failed to delete branch.");
        }
    }
}
