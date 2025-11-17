namespace ConsulTEA.Entities
{
    public class Appointment
    {
        public int IdAppointment { get; set; }
        public int IdPatient { get; set; }
        public int IdDoctor { get; set; }
        public DateTime? Date { get; set; }
        public string MainComplaint { get; set; } = string.Empty;
        public string BehaviorObservation { get; set; } = string.Empty;
        public string CommunicationNotes { get; set; } = string.Empty;
        public string SensoryNotes { get; set; } = string.Empty;
        public string SocialInteraction { get; set; } = string.Empty;
        public string MedicationInUse { get; set; } = string.Empty;
        public string EvolutionSummary { get; set; } = string.Empty;
        public string NextSteps { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}