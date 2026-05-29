using LendersTitle.UI.Models.Auth;

namespace LendersTitle.UI.Interfaces.ServiceInterface;

public interface IAuthServiceInterface
{
    Task<LoginUserDto?> ValidateUserAsync(string email, string password);
}
