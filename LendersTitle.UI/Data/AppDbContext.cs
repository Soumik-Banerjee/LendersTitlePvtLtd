using Microsoft.EntityFrameworkCore;

namespace LendersTitle.UI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> option) : base(option) { }
    }
}
