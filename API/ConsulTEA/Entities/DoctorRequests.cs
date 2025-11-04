namespace ConsulTEA.Entities
{
    public record DoctorLogInRequest (string Cpf, string Password);
    public record DoctorRegisterRequest(string Name, string Cpf, string Crm, string Specialty, string Email, string Password);
    
}
