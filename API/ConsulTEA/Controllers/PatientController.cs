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

        // Gets pacient by name
        [HttpGet("get")]
        public async Task<IActionResult> GetPatientByCpf(PatientGetRequest request)
        {
            _logger.LogInformation("Get Patient Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM PatientIdentification WHERE name ILIKE '%' || @Name || '%'";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("name", request.Name);

                await using var reader = await cmd.ExecuteReaderAsync();

                var patients = new List<Patient>();

                while (await reader.ReadAsync())
                {
                    patients.Add(new Patient
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Name = reader.GetString(reader.GetOrdinal("name")),
                        Cpf = reader.GetString(reader.GetOrdinal("cpf")),
                        BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
                        ContactPhone = reader.GetString(reader.GetOrdinal("contact_phone")),
                        GuardianName = reader.GetString(reader.GetOrdinal("guardian_name")),
                        GuardianContact = reader.GetString(reader.GetOrdinal("guardian_contact")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                    });
                }

                return Ok(patients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Inserts new patient
        [HttpPost("new")]
        public async Task<IActionResult> InsertNewPatient(PatientInsertRequest request)
        {
            _logger.LogInformation("Insert Patient Request");

            try 
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = """
                    INSERT INTO PatientIdentification 
                        (name, cpf, birth_date, contact_phone, guardian_name, guardian_contact, created_at) 
                    VALUES 
                        (@Name, @Cpf, @BirthDate, @ContactPhone, @GuardianName, @GuardianContact, @CreatedAt)
                    """;
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("Name", request.Name);
                cmd.Parameters.AddWithValue("Cpf", request.Cpf);
                cmd.Parameters.AddWithValue("BirthDate", request.BirthDate);
                cmd.Parameters.AddWithValue("ContactPhone", request.ContactPhone);
                cmd.Parameters.AddWithValue("GuardianName", request.GuardianName);
                cmd.Parameters.AddWithValue("GuardianContact", request.GuardianContact);
                cmd.Parameters.AddWithValue("CreatedAt", request.CreatedAt);

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

        // Alter patient -- needs revision on the request
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, PatientUpdateRequest request)
        {
            _logger.LogInformation($"Update Patient Request");

            if (request == null)
                return BadRequest("Dados do paciente inválidos.");

            try
            {
                await using var conn = await _dbService.GetConnection();

                var query = """
                    UPDATE PatientIdentification
                    SET 
                        name = @Name,
                        cpf = @Cpf,
                        birth_date = @BirthDate,
                        contact_phone = @ContactPhone,
                        guardian_name = @GuardianName,
                        guardian_contact = @GuardianContact,
                        created_at = @CreatedAt,
                    WHERE id_patient = @Id
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("Name", request.Name ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("Cpf", request.Cpf ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("BirthDate", request.BirthDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("ContactPhone", request.ContactPhone ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("GuardianName", request.GuardianName ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("GuardianContact", request.GuardianContact ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("CreatedAt", request.CreatedAt ?? (object)DBNull.Value);
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
