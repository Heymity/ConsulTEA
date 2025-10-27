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
    //[Authorize]
    public class PatientController : ControllerBase
    {
        private readonly ILogger<PatientController> _logger;
        private readonly DataAccessLayer _dbService;

        public PatientController(ILogger<PatientController> logger, DataAccessLayer dbService)
        {
            _logger = logger;
            _dbService = dbService;
        }

        // Gets pacient by cpf
        [HttpGet("get")]
        public async Task<IActionResult> GetPatientByCpf(string cpf)
        {
            _logger.LogInformation("Get Patient Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM bd_dados_paciente WHERE cpf = @cpf";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("cpf", cpf);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Ok(new Patient
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Name = reader.GetString(reader.GetOrdinal("name")),
                        Cpf = reader.GetString(reader.GetOrdinal("cpf"))
                    });
                }

                return NotFound($"Paciente com CPF {cpf} não encontrado.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Inserts new patient
        [HttpPost("new")]
        public async Task<IActionResult> InsertNewPatient(Patient patient)
        {
            _logger.LogInformation("Insert Patient Request");

            try 
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "INSERT INTO bd_dados_paciente (name, cpf) VALUES (@Name, @Cpf)";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("Name", patient.Name);
                cmd.Parameters.AddWithValue("Cpf", patient.Cpf);

                var result = await cmd.ExecuteNonQueryAsync();

                if (result > 0)
                    return Ok("Paciente inserido com sucesso");
                else
                    return StatusCode(500, "Falha ao inserir paciente");
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Erro ao buscar paciente.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Alter patient
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            _logger.LogInformation($"Update Patient Request");

            try
            {
                await using var conn = await _dbService.GetConnection();

                var query = """
                    UPDATE bd_dados_paciente
                    SET name = @Name, cpf = @Cpf
                    WHERE id_patient = @Id
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("Name", patient.Name);
                cmd.Parameters.AddWithValue("Cpf", patient.Cpf);
                cmd.Parameters.AddWithValue("Id", id);

                var result = await cmd.ExecuteNonQueryAsync();

                if (result > 0)
                    return Ok($"Paciente com ID {id} atualizado com sucesso.");
                else
                    return NotFound($"Paciente com ID {id} não encontrado.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao atualizar paciente com ID {id}");
                return StatusCode(500, "Erro interno no servidor");
            }
        }
    }
}
