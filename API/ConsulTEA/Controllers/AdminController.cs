using ConsulTEA.Authentication;
using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "Admin")]
    public class AdminController(ILogger<AdminController> logger, DataAccessLayer db, TokenProvider tokenProvider) : ControllerBase
    {
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAdmin([FromBody] AdminLoginRequest adminData)
        {
            logger.LogInformation($"Admin Login Request: {adminData}");

            try
            {
                await using var conn = await db.GetConnection();

                var query = """
                            SELECT adm.cpf, adm.password, doc.crm
                            FROM bd_admin AS adm 
                                LEFT JOIN bd_doctor_identification AS doc 
                                    ON adm.cpf = doc.cpf 
                            WHERE adm.cpf = @cpf
                            """;

                await using var cmd = new NpgsqlCommand(query, conn);

                cmd.Parameters.AddWithValue("cpf", adminData.Cpf);

                var reader = await cmd.ExecuteReaderAsync();// as AdminLoginDbResponse;
                await reader.ReadAsync();
                if (reader.IsDBNull(0)) return Unauthorized("Incorrect Credentials");
                
                var dbResult = new AdminLoginDbResponse(
                    reader.GetString(reader.GetOrdinal("cpf")), 
                    reader.GetString(reader.GetOrdinal("password")), 
                    reader.IsDBNull(reader.GetOrdinal("crm")) ? string.Empty : reader.GetString(reader.GetOrdinal("crm")));
                
                if (dbResult.Password != adminData.Password) return Unauthorized("Incorrect Credentials");
                
                logger.LogInformation($"Admin Logged successfully: {adminData.Cpf}");
                var token = tokenProvider.GenerateToken(adminData.Cpf,
                    string.IsNullOrEmpty(dbResult.Crm)
                        ? PrivilegeLevel.Admin
                        : PrivilegeLevel.Doctor | PrivilegeLevel.Admin);

                return Ok(new { token = token });

            }
            catch (Exception e)
            {
                logger.LogError($"Admin Login Request: {adminData} Error: {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
        
        [HttpPost("new")]
        public async Task<IActionResult> CreateAdmin([FromBody] AdminLoginRequest adminData)
        {
            logger.LogInformation($"Admin Login Request: {adminData}");

            try
            {
                await using var conn = await db.GetConnection();

                var query = """
                            SELECT adm.cpf
                            FROM bd_admin AS adm 
                            WHERE adm.cpf = @cpf
                            """;

                await using var queryCmd = new NpgsqlCommand(query, conn);
                queryCmd.Parameters.AddWithValue("cpf", adminData.Cpf);

                var result = await queryCmd.ExecuteScalarAsync();
                if (result is not null) return BadRequest("Admin already exists");

                var createQuery = "INSERT INTO bd_admin (cpf, password) VALUES (@cpf, @password);";
                await using var createCmd = new NpgsqlCommand(createQuery, conn);
                createCmd.Parameters.AddWithValue("cpf", adminData.Cpf);
                createCmd.Parameters.AddWithValue("password", adminData.Password);

                var insertResult = await createCmd.ExecuteNonQueryAsync();
                
                return insertResult > 0 ? Ok("Admin inserted") : StatusCode(500, "Admin insertion failed");
            }
            catch (Exception e)
            {
                logger.LogError($"Admin Login Request: {adminData} Error: {e.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
