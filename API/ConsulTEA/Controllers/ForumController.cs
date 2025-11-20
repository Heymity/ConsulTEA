using System.Text.Json;
using System.Text.Json.Serialization;
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
    private readonly JsonSerializerOptions _seriesJsonOptions = new()
    {
        AllowTrailingCommas = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString | JsonNumberHandling.AllowNamedFloatingPointLiterals,
    };
    
    [HttpPost("Post")]
    //[Authorize("Admin")]
    public async Task<IActionResult> CreatePost([FromBody] ForumPost post)
    {
        logger.LogInformation("Insert Post");

        try
        {
            await using var conn = await dbService.GetConnection();
            await using var transaction = await conn.BeginTransactionAsync();

            try
            {
                const string query = "INSERT INTO bd_forum_post (title)  VALUES (@title) RETURNING id";

                await using var cmdPost = new NpgsqlCommand(query, conn, transaction);
                cmdPost.Parameters.AddWithValue("title", post.Title);

                var postId = (int)(await cmdPost.ExecuteScalarAsync() ?? throw new InvalidOperationException("Returned postId is null"));
                
                const string sectionQuery = "INSERT INTO bd_forum_section (id_forum_post, type, text, image_uri, graph_type, section_order) VALUES (@postId, @type, @text, @imageUri, @graphType, @sectionOrder) RETURNING id";
                
                foreach (var sec in post.Sections)
                {
                    await using var cmdSection = new NpgsqlCommand(sectionQuery, conn, transaction);
                    cmdSection.Parameters.AddWithValue("postId", postId);
                    cmdSection.Parameters.AddWithValue("type", sec.Type);
                    cmdSection.Parameters.AddWithValue("text", sec.Text);
                    cmdSection.Parameters.AddWithValue("imageUri", sec.ImageUri);
                    cmdSection.Parameters.AddWithValue("graphType", sec.GraphType);
                    cmdSection.Parameters.AddWithValue("sectionOrder", sec.SectionOrder);
                    
                    var secId = (int)(await cmdSection.ExecuteScalarAsync() ?? throw new InvalidOperationException("Returned secId is null"));

                    foreach (var (key, value) in sec.DataSeries) 
                    {
                        const string seriesQuery =
                            "INSERT INTO bd_forum_data_series (id_forum_section, json_file, data_path, series_pathname) VALUES (@idSection, @json, @dataPath, @seriesKey)";
                        
                        var json = JsonSerializer.Serialize(value, _seriesJsonOptions);
                        
                        await using var cmdSeries = new NpgsqlCommand(seriesQuery, conn, transaction);
                        cmdSeries.Parameters.AddWithValue("idSection", secId);
                        cmdSeries.Parameters.AddWithValue("json", json);
                        cmdSeries.Parameters.AddWithValue("dataPath", "NOT USED");
                        cmdSeries.Parameters.AddWithValue("seriesKey", key);
                        
                        await cmdSeries.ExecuteNonQueryAsync();
                    }
                }
                
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Insert Post");
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Insert Appointment Request");
            return StatusCode(500, "Internal Server Error");
        }

        return Ok(post);
    }

    [HttpGet("Post/{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPostById(int id)
    {
        logger.LogInformation("Get Post {Id}", id);

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
                DataSeries = new Dictionary<string, List<string>>()
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
                        DataSeries = new Dictionary<string, List<string>>()
                    };
                    
                    post.Sections.Add(currentSection);
                }

                if (await reader.IsDBNullAsync(reader.GetOrdinal("series_id"))) continue;
                
                var json = reader.GetString(reader.GetOrdinal("json_file"));
                var data = JsonSerializer.Deserialize<List<string>>(json, _seriesJsonOptions) ?? [];
                    
                var seriesKey = reader.GetString(reader.GetOrdinal("series_pathname"));
                currentSection.DataSeries.Add(seriesKey, data);
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