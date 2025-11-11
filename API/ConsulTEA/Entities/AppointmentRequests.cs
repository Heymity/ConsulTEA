namespace ConsulTEA.Entities
{
    public record AppointmentInsertRequest(int IdPatient, DateTime Date, string MainComplaint, string BehaviorObservation, string CommunicationNotes, string SensoryNotes, string SocialInteraction, string MedicationInUse, string EvolutionSummary, string NextSteps);
    public record AppointmentUpdateRequest(int IdPatient, DateTime Date, string MainComplaint, string BehaviorObservation, string CommunicationNotes, string SensoryNotes, string SocialInteraction, string MedicationInUse, string EvolutionSummary, string NextSteps);
}