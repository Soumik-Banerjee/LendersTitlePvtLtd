using Microsoft.Data.SqlClient;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Models.Auth;

namespace LendersTitle.UI.Repositories;

public class UserSessionRepository : IUserSessionRepository
{
    private readonly string _connectionString;

    public UserSessionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found.");
    }

    public async Task DeleteOldSessionsAsync(string sessionId)
    {
        const string sql = @"
            DELETE FROM dbo.UserSessions 
            WHERE SessionId = @SessionId AND AbsoluteExpiryAt < DATEADD(DAY, -7, GETDATE())";
        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@SessionId", sessionId);
        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task CreateSessionAsync(UserSessionDto session)
    {
        const string sql = @"
            INSERT INTO dbo.UserSessions (SessionId, UserName, FullName, LoginAt, LastActivityAt, 
                AbsoluteExpiryAt, DeviceInfo, IPAddress, IsActive, BrowserName, OSName, DeviceType)
            VALUES (@SessionId, @UserName, @FullName, @LoginAt, @LastActivityAt, 
                @AbsoluteExpiryAt, @DeviceInfo, @IPAddress, 1, @BrowserName, @OSName, @DeviceType)";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@SessionId", session.SessionId);
        command.Parameters.AddWithValue("@UserName", session.UserName);
        command.Parameters.AddWithValue("@FullName", (object?)session.FullName ?? DBNull.Value);
        command.Parameters.AddWithValue("@LoginAt", session.LoginAt);
        command.Parameters.AddWithValue("@LastActivityAt", session.LastActivityAt);
        command.Parameters.AddWithValue("@AbsoluteExpiryAt", session.AbsoluteExpiryAt);
        command.Parameters.AddWithValue("@DeviceInfo", (object?)session.DeviceInfo ?? DBNull.Value);
        command.Parameters.AddWithValue("@IPAddress", (object?)session.IPAddress ?? DBNull.Value);
        command.Parameters.AddWithValue("@BrowserName", (object?)session.BrowserName ?? DBNull.Value);
        command.Parameters.AddWithValue("@OSName", (object?)session.OSName ?? DBNull.Value);
        command.Parameters.AddWithValue("@DeviceType", (object?)session.DeviceType ?? DBNull.Value);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task<bool> IsSessionActiveAsync(string sessionId)
    {
        const string sql = @"
            SELECT COUNT(1) FROM dbo.UserSessions 
            WHERE SessionId = @SessionId 
              AND IsActive = 1 
              AND AbsoluteExpiryAt > GETUTCDATE()";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@SessionId", sessionId);

        await connection.OpenAsync();
        var count = Convert.ToInt32(await command.ExecuteScalarAsync());
        return count > 0;
    }

    public async Task UpdateActivityAsync(string sessionId)
    {
        const string sql = @"
            UPDATE dbo.UserSessions 
            SET LastActivityAt = GETUTCDATE() 
            WHERE SessionId = @SessionId";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@SessionId", sessionId);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task RevokeSessionAsync(string sessionId, string? revokedBy = null, string? revokeReason = null)
    {
        const string sql = @"
            UPDATE dbo.UserSessions 
            SET IsActive = 0, LogoutAt = GETUTCDATE(), RevokedBy = @RevokedBy, RevokeReason = @RevokeReason
            WHERE SessionId = @SessionId";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@SessionId", sessionId);
        command.Parameters.AddWithValue("@RevokedBy", (object?)revokedBy ?? DBNull.Value);
        command.Parameters.AddWithValue("@RevokeReason", (object?)revokeReason ?? DBNull.Value);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task RevokeAllUserSessionsAsync(string userName)
    {
        const string sql = @"
            UPDATE dbo.UserSessions 
            SET IsActive = 0, LogoutAt = GETUTCDATE()
            WHERE UserName = @UserName AND IsActive = 1";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@UserName", userName);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();
    }

    public async Task<List<UserSessionDto>> GetActiveSessionsAsync()
    {
        var sessions = new List<UserSessionDto>();

        const string sql = @"
            SELECT SessionId, UserName, FullName, LoginAt, LastActivityAt, 
                   AbsoluteExpiryAt, DeviceInfo, IPAddress, IsActive,
                   BrowserName, OSName, DeviceType, LogoutAt, RevokedBy, RevokeReason
            FROM dbo.UserSessions 
            WHERE IsActive = 1 
            ORDER BY LoginAt DESC";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);

        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            sessions.Add(new UserSessionDto
            {
                SessionId = reader["SessionId"].ToString() ?? "",
                UserName = reader["UserName"].ToString() ?? "",
                FullName = reader["FullName"]?.ToString() ?? "",
                LoginAt = Convert.ToDateTime(reader["LoginAt"]),
                LastActivityAt = Convert.ToDateTime(reader["LastActivityAt"]),
                AbsoluteExpiryAt = Convert.ToDateTime(reader["AbsoluteExpiryAt"]),
                DeviceInfo = reader["DeviceInfo"]?.ToString(),
                IPAddress = reader["IPAddress"]?.ToString(),
                IsActive = Convert.ToBoolean(reader["IsActive"]),
                BrowserName = reader["BrowserName"]?.ToString(),
                OSName = reader["OSName"]?.ToString(),
                DeviceType = reader["DeviceType"]?.ToString(),
                LogoutAt = reader["LogoutAt"] != DBNull.Value ? Convert.ToDateTime(reader["LogoutAt"]) : null,
                RevokedBy = reader["RevokedBy"]?.ToString(),
                RevokeReason = reader["RevokeReason"]?.ToString()
            });
        }

        return sessions;
    }
}
