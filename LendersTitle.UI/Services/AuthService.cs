using Microsoft.AspNetCore.Identity;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Interfaces.ServiceInterface;
using LendersTitle.UI.Models.Auth;

namespace LendersTitle.UI.Services;

public class AuthService : IAuthServiceInterface
{
    private readonly IUserRepository _userRepo;
    //private readonly PasswordHasher<object> _passwordHasher = new();

    public AuthService(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<LoginUserDto?> ValidateUserAsync(string email, string password)
    {
        var user = await _userRepo.GetUserByEmailAsync(email);
        if (user == null) return null;

        var isActive = await _userRepo.IsUserActiveAsync(user.UserName);
        if (!isActive) return null;

        var storedHash = await _userRepo.GetPasswordHashAsync(user.UserName);
        if (storedHash == null) return null;

        //var result = _passwordHasher.VerifyHashedPassword(default!, storedHash, password);
        //if (result == PasswordVerificationResult.Failed) return null;

        return user;
    }

}
