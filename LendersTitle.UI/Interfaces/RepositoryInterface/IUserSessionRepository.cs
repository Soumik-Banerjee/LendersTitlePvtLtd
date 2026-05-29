using LendersTitle.UI.Models.Auth;
namespace LendersTitle.UI.Interfaces.RepositoryInterface;

public interface IUserSessionRepository
{
    Task DeleteOldSessionsAsync(string sessionId);
    Task CreateSessionAsync(UserSessionDto session);
    Task<bool> IsSessionActiveAsync(string sessionId);
    Task UpdateActivityAsync(string sessionId);
    Task RevokeSessionAsync(string sessionId, string? revokedBy = null, string? revokeReason = null);
    Task RevokeAllUserSessionsAsync(string userName);
    Task<List<UserSessionDto>> GetActiveSessionsAsync();
}
