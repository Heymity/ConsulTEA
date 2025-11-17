// AddAppointment.tsx
import './AddAppointment.css';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AddAppointment() {
  const { patientId } = useParams();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      patientId,
      ...formData
    });
    alert('Anamnese registrada com sucesso! (mock)');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md w-full">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TEA Data</h1>
          <nav className="flex space-x-8 text-lg font-semibold">
            <a href="/home" className="hover:underline">Início</a>
            <a href="/see-patients" className="hover:underline">Pacientes</a>
            <a href="#" className="hover:underline">Sair</a>
          </nav>
        </div>
      </header>

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
