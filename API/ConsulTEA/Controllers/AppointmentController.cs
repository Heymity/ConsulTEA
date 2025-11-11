using System.Security.Claims;
using ConsulTEA.Entities;
using ConsulTEA.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Npgsql;

namespace ConsulTEA.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize("Doctor")]
    public class AppointmentController : ControllerBase
    {
        private readonly ILogger<AppointmentController> _logger;
        private readonly DataAccessLayer _dbService;

        public AppointmentController(ILogger<AppointmentController> logger, DataAccessLayer dbService) 
        {
            _logger = logger;
            _dbService = dbService;
        }

        private static Appointment ReadAppointment(NpgsqlDataReader reader)
        {
            return new Appointment
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
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at")),
            };
        }

        // Returns the Data of an Appointment by the Appointment Id
        [HttpGet("get/Appointment/{id}")]
        public async Task<IActionResult> GetAppointmentByAppointmentId(int id)
        {
            _logger.LogInformation("Get Appointment Request by Appointment Id");

            try
            {
                var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                if (cpfClaim is null) return Unauthorized("Não está logado como médico");

                var doctorCpf = cpfClaim.Value;
                
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                const string query = "SELECT * FROM bd_dados_exame WHERE id_appointment = @id AND id_doctor = (SELECT bd_doctor_identification.id_doctor FROM bd_doctor_identification WHERE cpf = @doctor_cpf)";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("doctor_cpf", doctorCpf);

                await using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return Ok(ReadAppointment(reader));
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
                var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                if (cpfClaim is null) return Unauthorized("Não está logado como médico");

                var doctorCpf = cpfClaim.Value;
                
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                const string query = "SELECT * FROM bd_dados_exame WHERE id_patient = @id AND id_doctor = (SELECT bd_doctor_identification.id_doctor FROM bd_doctor_identification WHERE cpf = @doctor_cpf)";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("id", id);
                cmd.Parameters.AddWithValue("doctor_cpf", doctorCpf);

                await using var reader = await cmd.ExecuteReaderAsync();

                var appointments = new List<Appointment>();
                
                while (await reader.ReadAsync())
                {
                    appointments.Add(ReadAppointment(reader));
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
        [HttpGet("get/Doctor")]
        public async Task<IActionResult> GetAppointmentByDoctorId()
        {
            _logger.LogInformation("Get Appointment Request by Doctor Id");

            try
            {
                var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                if (cpfClaim is null) return Unauthorized("Não está logado como médico");

                var doctorCpf = cpfClaim.Value;
                
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                const string query = "SELECT * FROM bd_dados_exame WHERE id_doctor = (SELECT bd_doctor_identification.id_doctor FROM bd_doctor_identification WHERE cpf = @doctor_cpf)";
                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("doctor_cpf", doctorCpf);

                await using var reader = await cmd.ExecuteReaderAsync();

                var appointments = new List<Appointment>();

                while (await reader.ReadAsync())
                {
                    appointments.Add(ReadAppointment(reader));
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
        public async Task<IActionResult> InsertNewAppointment([FromBody] AppointmentInsertRequest request)
        {
            _logger.LogInformation("Insert Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                if (request.IdPatient == null)
                    return NotFound("É necessário passar um médico e um paciente");

                var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                if (cpfClaim is null) return Unauthorized("Não está logado como médico");

                var doctorCpf = cpfClaim.Value;
                
                const string query = """
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
                                             next_steps
                                         )
                                         VALUES (
                                             (SELECT bd_doctor_identification.id_doctor FROM bd_doctor_identification WHERE cpf = @doctor_cpf), 
                                             @idPatient, 
                                             @date, 
                                             @mainComplaint, 
                                             @behaviorObservation, 
                                             @communicationNotes, 
                                             @sensoryNotes, 
                                             @socialInteraction, 
                                             @medicationInUse, 
                                             @evolutionSummary, 
                                             @nextSteps
                                         )
                                     """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("date", request.Date);
                cmd.Parameters.AddWithValue("mainComplaint", request.MainComplaint);
                cmd.Parameters.AddWithValue("doctor_cpf", doctorCpf);
                cmd.Parameters.AddWithValue("idPatient", request.IdPatient);
                cmd.Parameters.AddWithValue("behaviorObservation", request.BehaviorObservation);
                cmd.Parameters.AddWithValue("communicationNotes", request.CommunicationNotes);
                cmd.Parameters.AddWithValue("sensoryNotes", request.SensoryNotes);
                cmd.Parameters.AddWithValue("socialInteraction", request.SocialInteraction);
                cmd.Parameters.AddWithValue("medicationInUse", request.MedicationInUse);
                cmd.Parameters.AddWithValue("evolutionSummary", request.EvolutionSummary);
                cmd.Parameters.AddWithValue("nextSteps", request.NextSteps);

                var result = await cmd.ExecuteNonQueryAsync();

                return result > 0 ? Ok("Exame inserido com sucesso") : StatusCode(500, "Falha ao inserir exame");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        // Updates Appointment by Id
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentUpdateRequest request)
        {
            _logger.LogInformation("Insert Appointment Request");

            try
            {
                // Creates/checks db conection
                await using var conn = await _dbService.GetConnection();

                if (request.IdPatient == null)
                    return NotFound("É necessário passar um médico e um paciente");

                var cpfClaim = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
                if (cpfClaim is null) return Unauthorized("Não está logado como médico");

                var doctorCpf = cpfClaim.Value;
                
                var query = """
                    UPDATE bd_dados_exame
                    SET 
                        id_patient = @idPatient,
                        date = @date,
                        main_complaint = @mainComplaint,
                        behavior_observation = @behaviorObservation,
                        communication_notes = @communicationNotes,
                        sensory_notes = @sensoryNotes,
                        social_interaction = @socialInteraction,
                        medication_in_use = @medicationInUse,
                        evolution_summary = @evolutionSummary,
                        next_steps = @nextSteps
                    WHERE id_appointment = @id AND id_doctor = (SELECT bd_doctor_identification.id_doctor FROM public.bd_doctor_identification WHERE cpf = @doctorCpf)
                """;

                await using var cmd = new NpgsqlCommand(query, conn);
                cmd.Parameters.AddWithValue("date", request.Date);
                cmd.Parameters.AddWithValue("mainComplaint", request.MainComplaint);
                cmd.Parameters.AddWithValue("doctorCpf", doctorCpf);
                cmd.Parameters.AddWithValue("idPatient", request.IdPatient);
                cmd.Parameters.AddWithValue("behaviorObservation", request.BehaviorObservation);
                cmd.Parameters.AddWithValue("communicationNotes", request.CommunicationNotes);
                cmd.Parameters.AddWithValue("sensoryNotes", request.SensoryNotes);
                cmd.Parameters.AddWithValue("socialInteraction", request.SocialInteraction);
                cmd.Parameters.AddWithValue("medicationInUse", request.MedicationInUse);
                cmd.Parameters.AddWithValue("evolutionSummary", request.EvolutionSummary);
                cmd.Parameters.AddWithValue("nextSteps", request.NextSteps);
                cmd.Parameters.AddWithValue("id", id);

                var result = await cmd.ExecuteNonQueryAsync();

                return result > 0 ? Ok("Exame atualizado com sucesso") : StatusCode(500, "Falha ao atualizar exame");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar exame.");
                return StatusCode(500, "Erro interno no servidor");
            }
        }
    }
}

