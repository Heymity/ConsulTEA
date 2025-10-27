using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly ILogger<AppointmentController> _logger;
        private readonly DataAccessLayer _dbService;

        public AppointmentController(ILogger<AppointmentController> logger, DataAccessLayer dbService) 
        {
            _logger = logger;
            _dbService = dbService;
        }

        // Returns the Data of a Appointment by Id
        [HttpGet("get")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            _logger.LogInformation("Get Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM bd_dados_exame WHERE id_appointment = @id";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Ok(new Appointment
                    {
                        IdAppointment = reader.GetInt32(reader.GetOrdinal("id_appointment")),
                        IdDoctor = reader.GetInt32(reader.GetOrdinal("id_doctor")),
                        IdPatient = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Date = reader.GetString(reader.GetOrdinal("date")),
                        Report = reader.GetString(reader.GetOrdinal("report"))
                    });
                }

                return NotFound($"Exame com id {id} não encontrado.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Inserts new appointment
        [HttpPost("new")]
        public async Task<IActionResult> InsertNewappointment(AppointmentInsertRequest request)
        {
            _logger.LogInformation("Insert Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                // Searchs doctor and patient Id
                int? doctorId = await GetIdByCpf(conn, "bd_dados_medico", request.CpfDoctor);
                int? patientId = await GetIdByCpf(conn, "bd_dados_paciente", request.CpfPatient);

                if (doctorId == null || patientId == null)
                    return NotFound("Médico ou paciente não encontrado.");

                var query = """
                    INSERT INTO bd_dados_exame (id_doctor, id_patient, date, report)
                    VALUES (@idDoctor, @idPatient, @date, @report)
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("date", request.Date);
                cmd.Parameters.AddWithValue("report", request.Report);
                cmd.Parameters.AddWithValue("idDoctor", doctorId);
                cmd.Parameters.AddWithValue("idPatient", patientId);

                var result = await cmd.ExecuteNonQueryAsync();

                if (result > 0)
                    return Ok("Exame inserido com sucesso");
                else
                    return StatusCode(500, "Falha ao inserir exame");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        private async Task<int?> GetIdByCpf(NpgsqlConnection conn, string tableName, string cpf)
        {
            var query = $"SELECT id FROM {tableName} WHERE cpf = @cpf";
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("cpf", cpf);

            var result = await cmd.ExecuteScalarAsync();
            return result != null ? Convert.ToInt32(result) : null;
        }
    }
}

