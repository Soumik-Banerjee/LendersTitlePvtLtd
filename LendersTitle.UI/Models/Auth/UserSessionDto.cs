namespace LendersTitle.UI.Models.Auth
{
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
        public string? BrowserName { get; set; }
        public string? OSName { get; set; }
        public string? DeviceType { get; set; }
        public DateTime? LogoutAt { get; set; }
        public string? RevokedBy { get; set; }
        public string? RevokeReason { get; set; }
    }
}
