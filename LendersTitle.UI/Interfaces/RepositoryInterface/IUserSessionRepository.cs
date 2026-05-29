namespace LendersTitle.UI.Interfaces.RepositoryInterface;

public class UserSessionDto
{
    public string SessionId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime LoginAt { get; set; }
    public DateTime LastActivityAt { get; set; }
    public DateTime AbsoluteExpiryAt { get; set; }
    public string? DeviceInfo { get; set; }
    public string? IPAddress { get; set; }
    public bool IsActive { get; set; }
}

public interface IUserSessionRepository
{
    Task CreateSessionAsync(UserSessionDto session);
    Task<bool> IsSessionActiveAsync(string sessionId);
    Task UpdateActivityAsync(string sessionId);
    Task RevokeSessionAsync(string sessionId);
    Task RevokeAllUserSessionsAsync(string userName);
    Task<List<UserSessionDto>> GetActiveSessionsAsync();
}
