using BCrypt.Net;
using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.IdentityModel.Tokens.Jwt;
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

            var query = "SELECT bdi.\"password\" FROM public.bd_doctor_identification AS bdi where bdi.cpf = @cpf";
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
        //[HttpPost]
        //[Route("[action]")]
        //public async Task<IActionResult> Register(DoctorRegisterRequest doctorRequest)
        //{
        //    var claim = User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti);
        //    string AdminCpf = string.Empty;

        //    if (claim is not null) AdminCpf = claim.Value;
        //    else return Unauthorized();



        //    bool isAdmin = await _context.Administrators.FirstOrDefaultAsync(d => d.Cpf == AdminCpf);
        //    if (isAdmin)
        //    {
        //        Doctor existingDoctor = await _context.Doctors // BANCO DE DADOS DOKO
        //            .FirstOrDefaultAsync(d => d.Cpf == doctorRequest.Cpf);
        //        if (existingDoctor != null)
        //        {
        //            return BadRequest("A doctor with this CPF already exists.");
        //        }

        //        Doctor doctor = new Doctor
        //        {
        //            Name = doctorRequest.Name,
        //            Crm = doctorRequest.Crm,
        //            Cpf = doctorRequest.Cpf,
        //            Specialty = doctorRequest.Specialty
        //        };

        //        _context.Doctors.Add(doctor); // BANCO DE DADOS DOKO
        //        await _context.SaveChangesAsync(); // BANCO DE DADOS DOKO

        //        return CreatedAtAction(nameof(Register), new { id = doctor.Id }, doctor);
        //    }
        //    else return Unauthorized();
        //}
    }
}