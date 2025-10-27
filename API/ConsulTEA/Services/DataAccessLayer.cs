using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace ConsulTEA.Services
{
    public class DataAccessLayer
    {
        private readonly string _connectionString;
        
        private readonly ILogger<DataAccessLayer> _logger;

        public DataAccessLayer(IConfiguration configuration, ILogger<DataAccessLayer> logger)
        {
            _logger = logger;
            _connectionString = configuration.GetConnectionString("postgres") ?? throw new ArgumentException(null, nameof(configuration));
            
            //_logger.Log(LogLevel.Information, $"Database connection string: {_connectionString}");
        }

        public async Task<NpgsqlConnection> GetConnection()
        {
            try
            {
                var conn = new NpgsqlConnection(_connectionString);
                await conn.OpenAsync();
                Console.WriteLine("Funfou, conexão estabelecida com sucesso");
                return conn;
            }
            catch (Exception ex)
            {
                throw new Exception($"Não funfou, falha na conexão: {ex.Message}");
            }
        }
    }
}
