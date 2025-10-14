using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace ConsulTEA.Authentication;

public class TokenProvider
{
    public string GenerateToken(string Cpf)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = "veryveryverySecretkeyThatNoOneKnowsAboutShhhhhhDontShareTHis"u8.ToArray();

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Cpf)
        };

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