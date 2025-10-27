namespace ConsulTEA.Entities
{
    public record PatientInsertRequest(string Name, string Cpf);
    public record PatientGetRequest(string Cpf);
}
