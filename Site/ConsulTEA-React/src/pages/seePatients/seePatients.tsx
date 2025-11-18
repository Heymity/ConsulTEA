// SeePatients.tsx
import Header from '../../components/header/Header';
import './SeePatients.css';
import { useEffect, useState } from 'react';

interface Anamnese {
  id: number;
  date: string;
}

interface Patient {
  id: number;
  name: string;
  cpf: string;
  birth: string;
  contact_phone: string;
  guardian_name: string;
  guardian_contact: string;
  anamneses?: Anamnese[];
}

export default function SeePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPatient, setExpandedPatient] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);

        // Mock data incl. anamneses
        const mockData: Patient[] = [
          { 
            id: 1, name: "Jicardo Ribeiro", cpf: "123.456.789-00", birth: "2015-03-10",
            contact_phone: "11 999232455", guardian_name: "", guardian_contact: "",
            anamneses: [
              { id: 1, date: "2024-01-15" },
              { id: 2, date: "2024-06-02" }
            ]
          },
          { 
            id: 2, name: "Sujiro Nakamura", cpf: "987.654.321-00", birth: "2018-07-22",
            contact_phone: "", guardian_name: "Lucas Sposo", guardian_contact: "11 997695543",
            anamneses: [
              { id: 1, date: "2024-03-09" }
            ]
          }
        ];

        setPatients(mockData);
      } catch (err) {
        setError('Erro ao carregar pacientes.');
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedPatient(prev => prev === id ? null : id);
  };

  const handleAddAnamnese = (id: number) => {
    window.location.href = `/add-appointment/${id}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      
      {/* Header */}
      <Header/>

      {/* Content */}
      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Pacientes
          </h2>

          {loading && <p className="loading-text">Carregando pacientes...</p>}
          {error && <p className="error-text">{error}</p>}

          <ul className="patients-list">
            {patients.map((p) => (
              <li key={p.id} className="patient-card">

                {/* MAIN CARD */}
                <div 
                  className="patient-summary"
                  onClick={() => toggleExpand(p.id)}
                >
                  <p className="patient-name">{p.name}</p>
                  <p className="patient-info"><strong>CPF:</strong> {p.cpf}</p>
                  <p className="patient-info"><strong>Nascimento:</strong> {p.birth}</p>
                </div>

                {/* DROPDOWN */}
                {expandedPatient === p.id && (
                  <div className="patient-dropdown">

                    {/** Dados extras */}
                    <p className="patient-info"><strong>Contato:</strong> {p.contact_phone || "-"}</p>
                    <p className="patient-info"><strong>Guardião:</strong> {p.guardian_name || "-"}</p>
                    <p className="patient-info"><strong>Contato Guardião:</strong> {p.guardian_contact || "-"}</p>

                    <button
                      className="add-anamnese-btn"
                      onClick={() => handleAddAnamnese(p.id)}
                    >
                      ➕ Adicionar Anamnese
                    </button>

                    <h4 className="anamnese-title">Anamneses anteriores:</h4>
                    <ul className="anamnese-list">
                      {p.anamneses && p.anamneses.length > 0 ? (
                        p.anamneses.map(a => (
                          <li key={a.id} className="anamnese-item">
                            📄 {a.date}
                          </li>
                        ))
                      ) : (
                        <li className="anamnese-item">Nenhuma anamnese registrada.</li>
                      )}
                    </ul>

                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
