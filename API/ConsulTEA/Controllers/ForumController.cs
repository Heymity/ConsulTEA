using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ConsulTEA.Controllers;

[ApiController]
[Route("[controller]")]
public class ForumController(ILogger<ForumController> logger, DataAccessLayer dbService) : ControllerBase
{
    [HttpPost("Post")]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePost([FromBody] ForumPost post)
    {
        return Ok(post);
    }

    [HttpGet("Post/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPostById(int id)
    {
        logger.LogInformation("Get Post {id}", id);

        try
        {
            await using var conn = await dbService.GetConnection();
            
            const string query = """
                                 SELECT post.id AS post_id, title, section.id AS section_id, id_forum_post, type, text, image_uri, graph_type, section_order, series.id AS series_id, id_forum_section, json_file, data_path, series_pathname
                                 FROM ((bd_forum_post AS post
                                 FULL JOIN bd_forum_section AS section
                                 ON post.id = section.id_forum_post) 
                                 FULL JOIN bd_forum_data_series AS series
                                 ON section.id = series.id_forum_section)
                                 WHERE post.id = @id
                                 ORDER BY section.section_order
                                 """;
            
            await using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("id", id);
            
            await using var reader = await cmd.ExecuteReaderAsync();

            if (!await reader.ReadAsync()) return NotFound();

            var post = new ForumPost
            {
                Id = reader.GetInt32(reader.GetOrdinal("post_id")),
                Title = reader.GetString(reader.GetOrdinal("title")),
                Sections = new List<PostSection>()
            };
            
            // read Sections
            
            var currentSectionId = reader.GetInt32(reader.GetOrdinal("section_id"));
            var currentSection = new PostSection
            {
                SectionId = currentSectionId,
                Type = reader.GetInt32(reader.GetOrdinal("type")),
                Text = reader.GetString(reader.GetOrdinal("text")),
                ImageUri = reader.GetString(reader.GetOrdinal("image_uri")),
                PostId = reader.GetInt32(reader.GetOrdinal("post_id")),
                GraphType = reader.GetInt32(reader.GetOrdinal("graph_type")),
                SectionOrder = reader.GetInt32(reader.GetOrdinal("section_order")),
                DataSeries = new Dictionary<string, List<double>>()
            };
            post.Sections.Add(currentSection);
            do
            {
                var secId = reader.GetInt32(reader.GetOrdinal("section_id"));
                if (secId != currentSectionId)
                {
                    currentSectionId = secId;
                    currentSection = new PostSection
                    {
                        SectionId = currentSectionId,
                        Type = reader.GetInt32(reader.GetOrdinal("type")),
                        Text = reader.GetString(reader.GetOrdinal("text")),
                        ImageUri = reader.GetString(reader.GetOrdinal("image_uri")),
                        PostId = reader.GetInt32(reader.GetOrdinal("post_id")),
                        GraphType = reader.GetInt32(reader.GetOrdinal("graph_type")),
                        SectionOrder = reader.GetInt32(reader.GetOrdinal("section_order")),
                        DataSeries = new Dictionary<string, List<double>>()
                    };
                    
                    post.Sections.Add(currentSection);
                }
                
                if (!await reader.IsDBNullAsync(reader.GetOrdinal("series_id")))
                {
                    var jsonFile = reader.GetString(reader.GetOrdinal("json_file"));
                    var path = reader.GetString(reader.GetOrdinal("data_path"));
                    
                    var seriesKey = reader.GetString(reader.GetOrdinal("series_pathname"));
                    currentSection.DataSeries.Add(seriesKey, new List<double>() {0, 0, 1, 1});
                }
            } while (await reader.ReadAsync());

            return Ok(post);

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Insert Appointment Request");
            return StatusCode(500, "Internal Server Error");
        }
    }
}