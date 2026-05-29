using LendersTitle.UI.Models.Auth;

namespace LendersTitle.UI.Interfaces.RepositoryInterface;

public interface IUserRepository
{
    Task<LoginUserDto?> GetUserByEmailAsync(string email);
    Task<string?> GetPasswordHashAsync(string userName);
    Task<bool> IsUserActiveAsync(string userName);
}
