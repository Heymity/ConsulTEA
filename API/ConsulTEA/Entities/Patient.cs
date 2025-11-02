namespace ConsulTEA.Entities
{
    public class Patient
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
        public string ContactPhone { get; set; } = string.Empty;
        public string GuardianName { get; set; } = string.Empty;
        public string GuardianContact { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
    }
}
