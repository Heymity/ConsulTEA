using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly ILogger<AppointmentController> _logger;
        private readonly DataAccessLayer _dbService;

        public AppointmentController(ILogger<AppointmentController> logger, DataAccessLayer dbService) 
        {
            _logger = logger;
            _dbService = dbService;
        }

        // Returns the Data of an Appointment by the Appointment Id
        [HttpGet("get/Appointment/{id}")]
        public async Task<IActionResult> GetAppointmentByAppointmentId(int id)
        {
            _logger.LogInformation("Get Appointment Request by Appointment Id");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM bd_dados_exame WHERE id_appointment = @id";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Ok(new Appointment
                    {
                        IdAppointment = reader.GetInt32(reader.GetOrdinal("id_appointment")),
                        IdDoctor = reader.GetInt32(reader.GetOrdinal("id_doctor")),
                        IdPatient = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Date = reader.GetDateTime(reader.GetOrdinal("date")),
                        MainComplaint = reader.GetString(reader.GetOrdinal("main_complaint")),
                        BehaviorObservation = reader.GetString(reader.GetOrdinal("behavior_observation")),
                        CommunicationNotes = reader.GetString(reader.GetOrdinal("communication_notes")),
                        SensoryNotes = reader.GetString(reader.GetOrdinal("sensory_notes")),
                        SocialInteraction = reader.GetString(reader.GetOrdinal("social_interaction")),
                        MedicationInUse = reader.GetString(reader.GetOrdinal("medication_in_use")),
                        EvolutionSummary = reader.GetString(reader.GetOrdinal("evolution_summary")),
                        NextSteps = reader.GetString(reader.GetOrdinal("next_steps")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                    });
                }

                return NotFound($"Exame com id {id} não encontrado.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Returns the Data of an Appointment by the Patient Id
        [HttpGet("get/Patient/{id}")]
        public async Task<IActionResult> GetAppointmentByPatientId(int id)
        {
            _logger.LogInformation("Get Appointment Request by Patient Id");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM bd_dados_exame WHERE id_patient = @id";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);

                await using var reader = await cmd.ExecuteReaderAsync();

                var appointments = new List<Appointment>();

                if (await reader.ReadAsync())
                {
                    appointments.Add(new Appointment
                    {
                        IdAppointment = reader.GetInt32(reader.GetOrdinal("id_appointment")),
                        IdDoctor = reader.GetInt32(reader.GetOrdinal("id_doctor")),
                        IdPatient = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Date = reader.GetDateTime(reader.GetOrdinal("date")),
                        MainComplaint = reader.GetString(reader.GetOrdinal("main_complaint")),
                        BehaviorObservation = reader.GetString(reader.GetOrdinal("behavior_observation")),
                        CommunicationNotes = reader.GetString(reader.GetOrdinal("communication_notes")),
                        SensoryNotes = reader.GetString(reader.GetOrdinal("sensory_notes")),
                        SocialInteraction = reader.GetString(reader.GetOrdinal("social_interaction")),
                        MedicationInUse = reader.GetString(reader.GetOrdinal("medication_in_use")),
                        EvolutionSummary = reader.GetString(reader.GetOrdinal("evolution_summary")),
                        NextSteps = reader.GetString(reader.GetOrdinal("next_steps")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                    });
                }

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Returns the Data of an Appointment by the Doctor Id
        [HttpGet("get/Doctor/{id}")]
        public async Task<IActionResult> GetAppointmentByDoctorId(int id)
        {
            _logger.LogInformation("Get Appointment Request by Doctor Id");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                var query = "SELECT * FROM bd_dados_exame WHERE id_doctor = @id";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);

                await using var reader = await cmd.ExecuteReaderAsync();

                var appointments = new List<Appointment>();

                if (await reader.ReadAsync())
                {
                    appointments.Add(new Appointment
                    {
                        IdAppointment = reader.GetInt32(reader.GetOrdinal("id_appointment")),
                        IdDoctor = reader.GetInt32(reader.GetOrdinal("id_doctor")),
                        IdPatient = reader.GetInt32(reader.GetOrdinal("id_patient")),
                        Date = reader.GetDateTime(reader.GetOrdinal("date")),
                        MainComplaint = reader.GetString(reader.GetOrdinal("main_complaint")),
                        BehaviorObservation = reader.GetString(reader.GetOrdinal("behavior_observation")),
                        CommunicationNotes = reader.GetString(reader.GetOrdinal("communication_notes")),
                        SensoryNotes = reader.GetString(reader.GetOrdinal("sensory_notes")),
                        SocialInteraction = reader.GetString(reader.GetOrdinal("social_interaction")),
                        MedicationInUse = reader.GetString(reader.GetOrdinal("medication_in_use")),
                        EvolutionSummary = reader.GetString(reader.GetOrdinal("evolution_summary")),
                        NextSteps = reader.GetString(reader.GetOrdinal("next_steps")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                    });
                }

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Inserts new appointment
        [HttpPost("new")]
        public async Task<IActionResult> InsertNewAppointment(AppointmentInsertRequest request)
        {
            _logger.LogInformation("Insert Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                if (request.IdDoctor == null || request.IdPatient == null)
                    return NotFound("É necessário passar um médico e um paciente");

                var query = """
                    INSERT INTO bd_dados_exame (
                        id_doctor, 
                        id_patient, 
                        date, 
                        main_complaint, 
                        behavior_observation, 
                        communication_notes, 
                        sensory_notes, 
                        social_interaction, 
                        medication_in_use, 
                        evolution_summary, 
                        next_steps, 
                        created_at
                    )
                    VALUES (
                        @idDoctor, 
                        @idPatient, 
                        @date, 
                        @mainComplaint, 
                        @behaviorObservation, 
                        @communicationNotes, 
                        @sensoryNotes, 
                        @socialInteraction, 
                        @medicationInUse, 
                        @evolutionSummary, 
                        @nextSteps, 
                        @createdAt
                    )
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("date", request.Date);
                cmd.Parameters.AddWithValue("mainComplaint", request.MainComplaint);
                cmd.Parameters.AddWithValue("idDoctor", request.IdDoctor);
                cmd.Parameters.AddWithValue("idPatient", request.IdPatient);
                cmd.Parameters.AddWithValue("behaviorObservation", request.BehaviorObservation);
                cmd.Parameters.AddWithValue("communicationNotes", request.CommunicationNotes);
                cmd.Parameters.AddWithValue("sensoryNotes", request.SensoryNotes);
                cmd.Parameters.AddWithValue("socialInteraction", request.SocialInteraction);
                cmd.Parameters.AddWithValue("medicationInUse", request.MedicationInUse);
                cmd.Parameters.AddWithValue("evolutionSummary", request.EvolutionSummary);
                cmd.Parameters.AddWithValue("nextSteps", request.NextSteps);
                cmd.Parameters.AddWithValue("createdAt", request.CreatedAt);

                var result = await cmd.ExecuteNonQueryAsync();

                if (result > 0)
                    return Ok("Exame inserido com sucesso");
                else
                    return StatusCode(500, "Falha ao inserir exame");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Updates Appointment by Id
        [HttpPut("update/{id}")]
        public async Task<IActionResult> InsertNewAppointment(int id, AppointmentInsertRequest request)
        {
            _logger.LogInformation("Insert Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                if (request.IdDoctor == null || request.IdPatient == null)
                    return NotFound("É necessário passar um médico e um paciente");

                var query = """
                    UPDATE bd_dados_exame
                    SET 
                        id_doctor = @idDoctor,
                        id_patient = @idPatient,
                        date = @date,
                        main_complaint = @mainComplaint,
                        behavior_observation = @behaviorObservation,
                        communication_notes = @communicationNotes,
                        sensory_notes = @sensoryNotes,
                        social_interaction = @socialInteraction,
                        medication_in_use = @medicationInUse,
                        evolution_summary = @evolutionSummary,
                        next_steps = @nextSteps,
                        updated_at = @updatedAt
                    WHERE id = @id
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("date", request.Date);
                cmd.Parameters.AddWithValue("mainComplaint", request.MainComplaint);
                cmd.Parameters.AddWithValue("idDoctor", request.IdDoctor);
                cmd.Parameters.AddWithValue("idPatient", request.IdPatient);
                cmd.Parameters.AddWithValue("behaviorObservation", request.BehaviorObservation);
                cmd.Parameters.AddWithValue("communicationNotes", request.CommunicationNotes);
                cmd.Parameters.AddWithValue("sensoryNotes", request.SensoryNotes);
                cmd.Parameters.AddWithValue("socialInteraction", request.SocialInteraction);
                cmd.Parameters.AddWithValue("medicationInUse", request.MedicationInUse);
                cmd.Parameters.AddWithValue("evolutionSummary", request.EvolutionSummary);
                cmd.Parameters.AddWithValue("nextSteps", request.NextSteps);
                cmd.Parameters.AddWithValue("createdAt", request.CreatedAt);

                var result = await cmd.ExecuteNonQueryAsync();

                if (result > 0)
                    return Ok("Exame atualizado com sucesso");
                else
                    return StatusCode(500, "Falha ao atualizar exame");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }
    }
}

