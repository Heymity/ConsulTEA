// AddAppointment.tsx
import './AddAppointment.css';
import { useState } from 'react';
import Header from '../../components/header/Header';
import { useLocation } from "react-router-dom";

export default function AddAppointment() {
  const location = useLocation();
  const patientId = location.state?.patientId;

  console.log("ID do paciente:", patientId);

  const [formData, setFormData] = useState({
    date: '',
    main_complaint: '',
    behavior_observation: '',
    communication_notes: '',
    sensory_notes: '',
    social_interaction: '',
    medication_in_use: '',
    evolution_summary: '',
    next_steps: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        alert("Você não está autenticado!");
        return;
      }

      const payload = {
        IdPatient: patientId,
        Date: formData.date,
        MainComplaint: formData.main_complaint,
        BehaviorObservation: formData.behavior_observation,
        CommunicationNotes: formData.communication_notes,
        SensoryNotes: formData.sensory_notes,
        SocialInteraction: formData.social_interaction,
        MedicationInUse: formData.medication_in_use,
        EvolutionSummary: formData.evolution_summary,
        NextSteps: formData.next_steps
      };
      
      console.log("Enviando payload:", payload);

      const res = await fetch("http://localhost:5000/Appointment/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Erro no cadastro");
      }

      alert("Anamnese registrada com sucesso!");
      window.location.href = "/see-patients";

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar anamnese.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      {/* Header */}
      <Header/>

      {/* Form */}
      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Nova Anamnese
          </h2>

          <div className="space-y-5">
            {/* Data */}
            <div>
              <label className="block font-semibold mb-1 text-blue-900">
                Data da consulta
              </label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campos de texto grandes */}
            {[
              { key: 'main_complaint', label: 'Queixa Principal' },
              { key: 'behavior_observation', label: 'Observações de Comportamento' },
              { key: 'communication_notes', label: 'Observações de Comunicação' },
              { key: 'sensory_notes', label: 'Sensibilidade Sensorial' },
              { key: 'social_interaction', label: 'Interação Social' },
              { key: 'medication_in_use', label: 'Medicações em Uso' },
              { key: 'evolution_summary', label: 'Resumo da Evolução' },
              { key: 'next_steps', label: 'Próximos Passos' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block font-semibold mb-1 text-blue-900">
                  {field.label}
                </label>
                <textarea
                  name={field.key}
                  className="form-input form-textarea"
                  value={(formData as any)[field.key]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white w-full py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Salvar Anamnese
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
