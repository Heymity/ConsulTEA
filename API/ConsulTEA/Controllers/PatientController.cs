using ConsulTEA.Entities;
using Microsoft.AspNetCore.Mvc;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using Npgsql;

namespace ConsulTEA.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize("Doctor")]
public class PatientController(ILogger<PatientController> logger, DataAccessLayer dbService)
    : ControllerBase
{
    private static Patient PatientFromReader(NpgsqlDataReader reader)
    {
        return new Patient
        {
            Id = reader.GetInt32(reader.GetOrdinal("id_patient")),
            Name = reader.GetString(reader.GetOrdinal("name")),
            Cpf = reader.GetString(reader.GetOrdinal("cpf")),
            BirthDate = reader.GetDateTime(reader.GetOrdinal("birth_date")),
            ContactPhone = reader.GetString(reader.GetOrdinal("contact_phone")),
            GuardianName = reader.GetString(reader.GetOrdinal("guardian_name")),
            GuardianContact = reader.GetString(reader.GetOrdinal("guardian_contact")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
        };
    }

    [HttpGet("get/Doctor")]
    public async Task<IActionResult> GetPatientsFromDoctor()
    {
        logger.LogInformation("Get Patient Request");

        try
        {
            var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
            if (cpfClaim is null) return Unauthorized("Não está logado como médico");

            var doctorCpf = cpfClaim.Value;
            
            await using var conn = await dbService.GetConnection();

            const string query = """
                                 SELECT * FROM PatientIdentification 
                                          WHERE id_patient IN (
                                          SELECT bd_dados_exame.id_patient FROM bd_dados_exame 
                                                                           WHERE id_doctor = (
                                                                           SELECT id_doctor FROM bd_doctor_identification 
                                                                                            WHERE bd_doctor_identification.cpf = @doctorCpf))
                                 """;
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("doctorCpf", doctorCpf);

            await using var reader = await cmd.ExecuteReaderAsync();

            var patients = new List<Patient>();

            while (await reader.ReadAsync())
            {
                patients.Add(PatientFromReader(reader));
            }

            return Ok(patients);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }
    
    // Gets pacient by name
    [HttpGet("get/cpf/{cpf}")]
    public async Task<IActionResult> GetPatientByCpf(string cpf)
    {
        logger.LogInformation("Get Patient Request");
        
        try
        {
            // Creates/checks db conection
            await using var conn = await dbService.GetConnection();

            const string query = "SELECT * FROM PatientIdentification WHERE cpf LIKE '%' || @cpf || '%'";
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("cpf", cpf);

            await using var reader = await cmd.ExecuteReaderAsync();

            var patients = new List<Patient>();

            while (await reader.ReadAsync())
            {
                patients.Add(PatientFromReader(reader));
            }

            return Ok(patients);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }
    
    // Gets pacient by name
    [HttpGet("get/name/{name}")]
    public async Task<IActionResult> GetPatientByName(string name)
    {
        logger.LogInformation("Get Patient Request");

        try
        {
            // Creates/checks db conection
            await using var conn = await dbService.GetConnection();

            const string query = "SELECT * FROM PatientIdentification WHERE name LIKE '%' || @Name || '%'";
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("Name", name);

            await using var reader = await cmd.ExecuteReaderAsync();

            var patients = new List<Patient>();

            while (await reader.ReadAsync())
            {
                patients.Add(PatientFromReader(reader));
            }

            return Ok(patients);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }

    // Inserts new patient
    [HttpPost("new")]
    public async Task<IActionResult> InsertNewPatient([FromBody] PatientInsertRequest request)
    {
        logger.LogInformation("Insert Patient Request");

        try 
        {
            // Creates/checks db conection
            await using var conn = await dbService.GetConnection();

            const string query = """
                                 INSERT INTO PatientIdentification 
                                     (name, cpf, birth_date, contact_phone, guardian_name, guardian_contact) 
                                 VALUES 
                                     (@Name, @Cpf, @BirthDate, @ContactPhone, @GuardianName, @GuardianContact)
                                 """;
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("Name", request.Name);
            cmd.Parameters.AddWithValue("Cpf", request.Cpf);
            cmd.Parameters.AddWithValue("BirthDate", request.BirthDate);
            cmd.Parameters.AddWithValue("ContactPhone", request.ContactPhone);
            cmd.Parameters.AddWithValue("GuardianName", request.GuardianName);
            cmd.Parameters.AddWithValue("GuardianContact", request.GuardianContact);
            cmd.Parameters.AddWithValue("CreatedAt", DateTime.UtcNow);

            var result = await cmd.ExecuteNonQueryAsync();

            return result > 0 ? Ok("Paciente inserido com sucesso") : BadRequest("Falha ao inserir paciente");
        }
        catch (Exception ex) 
        {
            logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }

    // Alter patient -- needs revision on the request
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientUpdateRequest request)
    {
        logger.LogInformation($"Update Patient Request");

        try
        {
            await using var conn = await dbService.GetConnection();

            const string query = """
                                     UPDATE PatientIdentification
                                     SET 
                                         name = @Name,
                                         cpf = @Cpf,
                                         birth_date = @BirthDate,
                                         contact_phone = @ContactPhone,
                                         guardian_name = @GuardianName,
                                         guardian_contact = @GuardianContact
                                     WHERE id_patient = @Id
                                 """;

            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("Name", request.Name ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("Cpf", request.Cpf ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("BirthDate", request.BirthDate);
            cmd.Parameters.AddWithValue("ContactPhone", request.ContactPhone ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("GuardianName", request.GuardianName ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("GuardianContact", request.GuardianContact ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("Id", id);

            var result = await cmd.ExecuteNonQueryAsync();

            return result > 0
                ? Ok($"Paciente com ID {id} atualizado com sucesso.")
                : NotFound($"Paciente com ID {id} não encontrado.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Erro ao atualizar paciente com ID {id}");
            return StatusCode(500, "Erro interno no servidor");
        }
    }
}