using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using ConsulTEA.Services;
using Npgsql;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly ILogger<PatientController> _logger;
        private readonly DataAccessLayer _dbService;

        public PatientController(ILogger<PatientController> logger, DataAccessLayer dbService)
        {
            _logger = logger;
            _dbService = dbService;
        }

        // Gets pacient by id
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            _logger.LogInformation("Get Patient Request");

            try
            {
                // Testa a conexão antes de usar
                var connected = await _dbService.TestConnectionAsync();
                if (!connected)
                    return StatusCode(500, "Falha ao conectar ao banco de dados");

                // Cria uma nova conexão PostgreSQL usando a mesma string de conexão
                await using var conn = _dbService.GetConnection();
                await conn.OpenAsync();

                var query = "SELECT * FROM patients WHERE id = @id";

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Ok(new Patient
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id")),
                        Name = reader.GetString(reader.GetOrdinal("name")),
                        Cpf = reader.GetString(reader.GetOrdinal("diagnosis"))
                    });
                }

                return NotFound($"Paciente com ID {id} não encontrado.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Inserts new patient
        [HttpPost("new")]
        public IActionResult InsertNewPatient(Patient patient)
        {
            _logger.Log(LogLevel.Information, "Insert Patient Request");

            var doctorId = User.Identity?.Name;

            if (patient is { Cpf: "420", Name: "Luquinhas" })
                return Ok($"Dados do paciente {patient} acessados pelo médico {doctorId}");
            else
                return Unauthorized();
        }

        // Alter patient
        [HttpPost("alter")]
        public IActionResult AlterPatientByCPF(int id)
        {
            _logger.Log(LogLevel.Information, "Get Patient Request");

            var doctorId = User.Identity?.Name;
            return Ok($"Dados do paciente {id}");
        }
    }
}
