using ConsulTEA.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ConsulTEA.Controllers

{
    [ApiController]
    [Route("[controller]")]
    public class DoctorController : ControllerBase
    {
        [HttpPost(Name = "PostNewDoctor")]
        public IActionResult DoctorLogin(DoctorLoginRequest doctor) 
        {
            //posible password = get doctor.password == doctor.cpf
            if (doctor.Password == "12345")
                return Ok();
            else
                return BadRequest();               
        }

    }
}
