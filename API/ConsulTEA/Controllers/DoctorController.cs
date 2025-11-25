using BCrypt.Net;
using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;


namespace ConsulTEA.Controllers;

[ApiController]
[Route("[controller]")]
public class DoctorController : ControllerBase
{
    private readonly ILogger<DoctorController> _logger;
    private readonly DataAccessLayer _dbService;
    private readonly TokenProvider _tokenProvider;

    public DoctorController(ILogger<DoctorController> logger, DataAccessLayer dbService,TokenProvider tokenProvider)
    {
        _logger = logger;
        _dbService = dbService;
        _tokenProvider = tokenProvider;
    }

    [HttpPost("post/login")]
    public async Task<IActionResult> Login(DoctorLogInRequest doctor)
    {
        _logger.Log(LogLevel.Information, "Doctor Login Request");

        await using var conn = await _dbService.GetConnection();


        var query = "SELECT bdi.\"password\" FROM public.bd_doctor_identification AS bdi where bdi.cpf = @cpf" ;

        await using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("cpf", doctor.Cpf);
        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            var dbPassword = reader.GetString(reader.GetOrdinal("password"));
            
            if (BCrypt.Net.BCrypt.Verify(doctor.Password, dbPassword))
                return Ok(new { token = _tokenProvider.GenerateToken(doctor.Cpf, PrivilegeLevel.Doctor) });
            else
                return Unauthorized();
        }
        return NotFound($"Medico com cpf {doctor.Cpf} não encontrado.");


    }
    
    [HttpPost("post/register")]
    [Authorize("Admin")]
    public async Task<IActionResult> Register(DoctorRegisterRequest doctorRequest)
    {
        _logger.Log(LogLevel.Information, "Doctor Register Request");

        try {
            await using var conn = await _dbService.GetConnection();

            const string query = "SELECT cpf FROM bd_doctor_identification where cpf = @cpf";
                
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("cpf", doctorRequest.Cpf);
            var cpf = await cmd.ExecuteScalarAsync();
            if (cpf is not null) return NotFound($"Medico com cpf {doctorRequest.Cpf} não encontrado.");
                
            const string insertQuery = "INSERT INTO public.bd_doctor_identification(name, cpf, crm, specialty, email, password) VALUES (@name, @cpf, @crm, @specialty,@email, @password)";
            await using var insertCmd = new NpgsqlCommand(insertQuery, conn);
            insertCmd.Parameters.AddWithValue("name", doctorRequest.Name);
            insertCmd.Parameters.AddWithValue("cpf", doctorRequest.Cpf);
            insertCmd.Parameters.AddWithValue("crm", doctorRequest.Crm);
            insertCmd.Parameters.AddWithValue("specialty", doctorRequest.Specialty);
            insertCmd.Parameters.AddWithValue("email", doctorRequest.Email);
            insertCmd.Parameters.AddWithValue("password", BCrypt.Net.BCrypt.HashPassword(doctorRequest.Password, workFactor: 12));

            var result = await insertCmd.ExecuteNonQueryAsync();
            
            return result > 0 ? Ok("Medico adicionado com sucesso") : NotFound("opsie daisy");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }

    [HttpGet("list")]
    [Authorize("Admin")]
    public async Task<IActionResult> ListDoctors()
    {
        _logger.Log(LogLevel.Information, "Doctors List");

        try
        {
            const string query = "SELECT * FROM bd_doctor_identification";

            await using var conn = await _dbService.GetConnection();
            await using var cmd = new NpgsqlCommand(query, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            var doctors = new List<Doctor>();

            while (await reader.ReadAsync())
            {
                doctors.Add(ReadDoctor(reader));
            }

            return Ok(doctors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar paciente.");
            return StatusCode(500, "Erro interno no servidor");
        }
    }

    private static Doctor ReadDoctor(NpgsqlDataReader reader)
    {
        return new Doctor()
        {   
            Cpf = reader.GetString(reader.GetOrdinal("cpf")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
            Crm = reader.GetString(reader.GetOrdinal("crm")),
            Email = reader.GetString(reader.GetOrdinal("email")),
            Name = reader.GetString(reader.GetOrdinal("name")),
            Specialty = reader.GetString(reader.GetOrdinal("specialty")),
            Id = reader.GetInt32(reader.GetOrdinal("id_doctor")),
        };
    }
    
}