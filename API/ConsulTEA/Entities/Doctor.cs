namespace ConsulTEA.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Crm { get; set; }
        public string Cpf { get; set; }
        public string Specialty { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string CreatedAt { get; set; }
    }
}
