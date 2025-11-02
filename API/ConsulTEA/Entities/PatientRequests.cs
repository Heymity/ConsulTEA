namespace ConsulTEA.Entities
{
    public record PatientInsertRequest(string Name, string Cpf, DateTime BirthDate, string ContactPhone, string GuardianName, string GuardianContact, DateTime CreatedAt);
    public record PatientUpdateRequest(string Name, string Cpf, DateTime BirthDate, string ContactPhone, string GuardianName, string GuardianContact, DateTime CreatedAt);
    public record PatientGetRequest(string Name);
}