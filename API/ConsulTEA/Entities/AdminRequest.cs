namespace ConsulTEA.Entities;

public record AdminLoginRequest(string Cpf, string Password);
public record AdminLoginDbResponse(string Cpf, string Password, string Crm);