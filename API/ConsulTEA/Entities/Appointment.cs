namespace ConsulTEA.Entities
{
    public class Appointment
    {
        public int IdAppointment { get; set; }
        public int IdPatient { get; set; }
        public int IdDoctor { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Report { get; set; } = string.Empty;
    }
}