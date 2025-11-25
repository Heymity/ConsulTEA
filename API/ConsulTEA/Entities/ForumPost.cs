namespace ConsulTEA.Entities;

public class ForumPost
{
    public int Id { get; set; }
    public string Title { get; set; } = "Untitled";

    public List<PostSection> Sections { get; set; } = new();
}