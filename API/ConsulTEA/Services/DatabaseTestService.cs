using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ConsulTEA.Services
{
    public class DatabaseTestService
    {
        private readonly string _connectionString;

        public DatabaseTestService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgreConnection");
        }

        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                await using var conn = new NpgsqlConnection(_connectionString);
                await conn.OpenAsync();
                Console.WriteLine("Funfou, conexão estabelecida com sucesso");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Não funfou, falha na conexão: {ex.Message}");
                return false;
            }
        }
    }
}
