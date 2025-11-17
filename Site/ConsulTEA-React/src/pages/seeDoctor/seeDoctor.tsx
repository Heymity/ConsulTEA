// SeeDoctor.tsx
import './SeeDoctor.css';
import { useEffect, useState } from 'react';

interface Doctor {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  speciality: string;    // this may cause trouble because the collumn on the DB is "specialty"
  email: string;
}

export default function SeeDoctor() {
  const [doctor, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDoctor, setExpandedDoctor] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);

        // Mock data incl. anamneses
        const mockData: Doctor[] = [
          { 
            id: 1, name: "Jicardo Ribeiro", cpf: "123.456.789-00", crm: "111", speciality: "Pediatra", email: "bruh@gmail.com"
          },
        { 
            id: 2, name: "Roberto Carlos", cpf: "333.456.744-10", crm: "420", speciality: "Cantor", email: "teste@gmail.com"
          }
        ];
        setDoctors(mockData);
      } catch (err) {
        setError('Erro ao carregar doutores.');
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedDoctor(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md w-full">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">ConsulTEA</h1>
          <nav className="flex space-x-8 text-lg font-semibold">
            <a href="/home" className="hover:underline">Início</a>
            <a href="/register-doctor" className="hover:underline">Cadastrar Médico</a>
            <a href="#" className="hover:underline">Sair</a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Médicos
          </h2>

          {loading && <p className="loading-text">Carregando Médicos...</p>}
          {error && <p className="error-text">{error}</p>}

          <ul className="doctor-list">
            {doctor.map((p) => (
              <li key={p.id} className="patient-card">

                {/* MAIN CARD */}
                <div 
                  className="doctor-summary"
                  onClick={() => toggleExpand(p.id)}
                >
                  <p className="doctor-name">{p.name}</p>
                  <p className="doctor-info"><strong>CPF:</strong> {p.cpf}</p>
                  <p className="doctor-info"><strong>CRM:</strong> {p.crm}</p>
                </div>

                {/* DROPDOWN */}
                {expandedDoctor === p.id && (
                  <div className="doctor-dropdown">

                    {/** Dados extras */}
                    <p className="doctor-info"><strong>Especialidade:</strong> {p.speciality}</p>
                    <p className="doctor-info"><strong>Email:</strong> {p.email}</p>
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
