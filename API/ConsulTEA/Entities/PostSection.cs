namespace ConsulTEA.Entities;

public class PostSection
{
    public int SectionId { get; set; }
    public int PostId { get; set; }
    public int Type { get; set; }
    public string Text { get; set; } = string.Empty;
    public string ImageUri { get; set; } = string.Empty;
    public int GraphType { get; set; } 
    public int SectionOrder { get; set; }
    public Dictionary<string, List<double>> DataSeries { get; set; } = new();
}