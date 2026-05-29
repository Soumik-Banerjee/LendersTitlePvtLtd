using LendersTitle.UI.Interfaces.RepositoryInterface;
using LendersTitle.UI.Models.BranchMasterModel;
using Microsoft.Data.SqlClient;

namespace LendersTitle.UI.Repositories
{
    public class BranchMasterRepository : BranchMasterRepoInterface
    {
        private readonly string _connectionString;

        public BranchMasterRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string not found.");
        }

        public async Task<List<BranchMasterGetModel>> GetAllAsync()
        {
            var branches = new List<BranchMasterGetModel>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT AutoId, Branch, IsActive FROM dbo.BranchMaster ORDER BY Branch", connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                branches.Add(new BranchMasterGetModel
                {
                    Id = Convert.ToInt32(reader["AutoId"]),
                    BranchName = reader["Branch"].ToString() ?? "",
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }

            return branches;
        }

        public async Task<BranchMasterGetModel?> GetByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT AutoId, Branch, IsActive FROM dbo.BranchMaster WHERE AutoId = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new BranchMasterGetModel
                {
                    Id = Convert.ToInt32(reader["AutoId"]),
                    BranchName = reader["Branch"].ToString() ?? "",
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                };
            }

            return null;
        }

        public async Task<int> CreateAsync(BranchMasterPostModel model)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(
                "INSERT INTO dbo.BranchMaster (Branch, IsActive) OUTPUT INSERTED.AutoId VALUES (@Branch, @IsActive)",
                connection);

            command.Parameters.AddWithValue("@Branch", model.BranchName);
            command.Parameters.AddWithValue("@IsActive", model.IsActive);

            await connection.OpenAsync();
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateAsync(BranchMasterPostModel model)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(
                "UPDATE dbo.BranchMaster SET Branch = @Branch, IsActive = @IsActive WHERE AutoId = @Id",
                connection);

            command.Parameters.AddWithValue("@Id", model.Id);
            command.Parameters.AddWithValue("@Branch", model.BranchName);
            command.Parameters.AddWithValue("@IsActive", model.IsActive);

            await connection.OpenAsync();
            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("DELETE FROM dbo.BranchMaster WHERE AutoId = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);

            await connection.OpenAsync();
            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> IsBranchNameExistsAsync(string branchName, int? excludeId = null)
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = excludeId.HasValue
                ? "SELECT COUNT(1) FROM dbo.BranchMaster WHERE Branch = @Branch AND AutoId != @ExcludeId"
                : "SELECT COUNT(1) FROM dbo.BranchMaster WHERE Branch = @Branch";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Branch", branchName);

            if (excludeId.HasValue)
                command.Parameters.AddWithValue("@ExcludeId", excludeId.Value);

            await connection.OpenAsync();
            var count = Convert.ToInt32(await command.ExecuteScalarAsync());
            return count > 0;
        }

        public async Task<int> GetActiveCountAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT COUNT(1) FROM dbo.BranchMaster WHERE IsActive = 1", connection);

            await connection.OpenAsync();
            return Convert.ToInt32(await command.ExecuteScalarAsync());
        }
    }
}
