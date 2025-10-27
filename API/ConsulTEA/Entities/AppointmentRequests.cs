namespace ConsulTEA.Entities
{
    //public record AppointmentGetRequest(string Name, string Cpf);
    public record AppointmentInsertRequest(string CpfDoctor, string CpfPatient, string Date, string Report);
}