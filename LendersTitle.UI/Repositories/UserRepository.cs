using Microsoft.Data.SqlClient;
using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Models.Auth;

namespace LendersTitle.UI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found.");
    }

    public async Task<LoginUserDto?> GetUserByEmailAsync(string email)
    {
        const string sql = @"
            SELECT u.AutoID, u.UserName, u.FullName, u.EmailID, u.Role, u.Branch, u.IsActive
            FROM dbo.UserMaster u
            WHERE u.EmailID = @Email";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Email", email);

        await connection.OpenAsync();
        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return new LoginUserDto
            {
                AutoId = Convert.ToInt32(reader["AutoID"]),
                UserName = reader["UserName"].ToString() ?? "",
                FullName = reader["FullName"]?.ToString() ?? "",
                Email = reader["EmailID"].ToString() ?? "",
                Role = reader["Role"].ToString() ?? "",
                Branch = reader["Branch"].ToString() ?? ""
            };
        }
        return null;
    }

    public async Task<string?> GetPasswordHashAsync(string userName)
    {
        const string sql = @"
            SELECT TOP 1 PasswordHash
            FROM dbo.UserPasswordManager
            WHERE UserName = @UserName
            ORDER BY AutoID DESC";

        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@UserName", userName);

        await connection.OpenAsync();
        return await command.ExecuteScalarAsync() as string;
    }

    public async Task<bool> IsUserActiveAsync(string userName)
    {
        const string sql = "SELECT IsActive FROM dbo.UserMaster WHERE UserName = @UserName";
        using var connection = new SqlConnection(_connectionString);
        using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@UserName", userName);

        await connection.OpenAsync();
        var result = await command.ExecuteScalarAsync();
        return result is DBNull ? false : Convert.ToBoolean(result);
    }
}
