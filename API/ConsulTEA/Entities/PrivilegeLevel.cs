namespace ConsulTEA.Entities;

[Flags]
public enum PrivilegeLevel : byte
{
    None = 0b0000_0000,
    Doctor = 0b0000_0001,
    Admin = 0b1000_0000,
}