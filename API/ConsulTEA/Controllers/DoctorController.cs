using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DoctorController(ILogger<DoctorController> logger, TokenProvider tokenProvider)
        : ControllerBase
    {
        [HttpPost]
        [Route("[action]")]
        public IActionResult Login(DoctorLoginRequest doctor) 
        {
            logger.Log(LogLevel.Information, "Doctor Login Request");
            
            // possible password = get doctor.password == doctor.cpf
            if (doctor is { Cpf: "1234", Password: "12345" })
                return Ok(new { token = tokenProvider.GenerateToken("1234") });
            else
                return Unauthorized();               
            
        }
    }
}
