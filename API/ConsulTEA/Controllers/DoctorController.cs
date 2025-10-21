//using ConsulTEA.Authentication;
//using ConsulTEA.Entities;
//using ConsulTEA.Services;
//using Microsoft.AspNetCore.Http.HttpResults;
//using Microsoft.AspNetCore.Mvc;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security;

//namespace ConsulTEA.Controllers
//{
//    [ApiController]
//    [Route("[controller]")]
//    public class DoctorController(ILogger<DoctorController> logger, TokenProvider tokenProvider, DataAccessLayer db)
//        : ControllerBase
//    {
//        [HttpPost]
//        [Route("[action]")]
//        public async Task<IActionResult> Login(DoctorLogInRequest doctor)
//        {
//            logger.Log(LogLevel.Information, "Doctor Login Request");

//            string dbPassword = await _context.INSERT_TABLE_NAME_HERE.FirstOrDefaultAsync(d => d.Cpf == doctor.Cpf);

//            if (doctor.Password == dbPassword)
//                return Ok(new { token = tokenProvider.GenerateToken(doctor.Cpf) });
//            else
//                return Unauthorized();               
            
//        }
//        [HttpPost]
//        [Route("[action]")]
//        public async Task<IActionResult> Register(DoctorRegisterRequest doctorRequest)
//        {
//            var claim = User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti);
//            string AdminCpf = string.Empty;

//            if (claim is not null) AdminCpf = claim.Value;
//            else return Unauthorized();



//            bool isAdmin = await _context.Administrators.FirstOrDefaultAsync(d => d.Cpf == AdminCpf);
//            if (isAdmin)
//            {
//                Doctor existingDoctor = await _context.Doctors // BANCO DE DADOS DOKO
//                    .FirstOrDefaultAsync(d => d.Cpf == doctorRequest.Cpf);
//                if (existingDoctor != null)
//                {
//                    return BadRequest("A doctor with this CPF already exists.");
//                }

//                Doctor doctor = new Doctor
//                {
//                    Name = doctorRequest.Name,
//                    Crm = doctorRequest.Crm,
//                    Cpf = doctorRequest.Cpf,
//                    Specialty = doctorRequest.Specialty
//                };

//                _context.Doctors.Add(doctor); // BANCO DE DADOS DOKO
//                await _context.SaveChangesAsync(); // BANCO DE DADOS DOKO

//                return CreatedAtAction(nameof(Register), new { id = doctor.Id }, doctor);
//            }
//            else return Unauthorized();
//        }
//    }
//}