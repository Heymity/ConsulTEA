namespace ConsulTEA.Entities
{
    public record AppointmentInsertRequest(int IdPatient, int IdDoctor, DateTime Date, string MainComplaint, string BehaviorObservation, string CommunicationNotes, string SensoryNotes, string SocialInteraction, string MedicationInUse, string EvolutionSummary, string NextSteps, DateTime CreatedAt);
    public record AppointmentUpdateRequest(int IdPatient, int IdDoctor, DateTime Date, string MainComplaint, string BehaviorObservation, string CommunicationNotes, string SensoryNotes, string SocialInteraction, string MedicationInUse, string EvolutionSummary, string NextSteps, DateTime CreatedAt);
}