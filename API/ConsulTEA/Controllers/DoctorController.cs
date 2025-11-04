using BCrypt.Net;
using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security;

namespace ConsulTEA.Controllers
{
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
                var hashed = BCrypt.Net.BCrypt.HashPassword(dbPassword, workFactor: 12);

                if (BCrypt.Net.BCrypt.Verify(doctor.Password, hashed))
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

            await using var conn = await _dbService.GetConnection();

            var query = "SELECT bdi.\"cpf\" FROM public.bd_doctor_identification where bdi.cpf = @cpf";
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("cpf", doctorRequest.Cpf);
            await using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                if (reader.IsDBNull(reader.GetOrdinal("cpf"))) 
                {
                    var insertQuery = "INSERT INTO public.bd_doctor_identification(name, cpf, crm, specialty, email, password) VALUES (@name, @cpf, @crm, @specialty,@email, @password)";
                    cmd.Parameters.AddWithValue("name", doctorRequest.Name);
                    cmd.Parameters.AddWithValue("cpf", doctorRequest.Cpf);
                    cmd.Parameters.AddWithValue("crm", doctorRequest.Crm);
                    cmd.Parameters.AddWithValue("specialty", doctorRequest.Specialty);
                    cmd.Parameters.AddWithValue("email", doctorRequest.Email);
                    cmd.Parameters.AddWithValue("password", doctorRequest.Password);
                }
                return BadRequest("A doctor with this CPF already exists.");
            }
            return NotFound($"Medico com cpf {doctorRequest.Cpf} não encontrado.");

        }
    }
}