using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConsulTEA.Entities;
using Microsoft.IdentityModel.Tokens;

namespace ConsulTEA.Authentication;

public class TokenProvider(IConfiguration configuration)
{
    public string GenerateToken(string Cpf, PrivilegeLevel privilegeLevel)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(configuration["jwt:key"] ?? throw new InvalidOperationException());

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Cpf),
        };
        
        if (privilegeLevel.HasFlag(PrivilegeLevel.Doctor)) claims.Add(new Claim(ClaimTypes.Role, "doctor"));
        if (privilegeLevel.HasFlag(PrivilegeLevel.Admin)) claims.Add(new Claim(ClaimTypes.Role, "admin"));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = "https://localhost:5001",
            Audience = "https://localhost:5001",
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}