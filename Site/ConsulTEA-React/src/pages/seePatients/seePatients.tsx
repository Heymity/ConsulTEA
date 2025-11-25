// SeePatients.tsx
import Header from '../../components/header/Header';
import './SeePatients.css';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

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
  const [patientsOriginal, setPatientsOriginal] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'cpf'>('name');


  useEffect(() => {
  async function fetchPatients() {
    try {
      setLoading(true);

      const token = localStorage.getItem("auth_token"); // ou onde você salvou
      const url = "http://localhost:5000/Patient/get/Doctor";


      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar pacientes");
      }

      const data = await res.json();

      // MAPEAMENTO dos nomes enviados pelo backend → nomes usados no front, pq eu postei cringe
      const mappedPatients: Patient[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        cpf: p.cpf,
        birth: p.birthDate,              // ajustado
        contact_phone: p.contactPhone,   // ajustado
        guardian_name: p.guardianName,   // ajustado
        guardian_contact: p.guardianContact, // ajustado
        anamneses: [] // virá vazio até integrarmos o backend de anamneses
      }));

      setPatients(mappedPatients);
      setPatientsOriginal(mappedPatients);

    } catch (err) {
      setError("Erro ao carregar pacientes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  fetchPatients();
}, []);


  const toggleExpand = (id: number) => {
    setExpandedPatient(prev => prev === id ? null : id);
  };

  const navigate = useNavigate();

  const handleAddAnamnese = (id: number) => {
    navigate("/add-appointment", { state: { patientId: id } });
  };

  function applyFilter(term: string, type: 'name' | 'cpf') {
  if (!term.trim()) {
    setPatients(patientsOriginal);
    return;
  }

  const lower = term.toLowerCase();

  const filtered = patientsOriginal.filter(p =>
    type === 'name'
      ? p.name.toLowerCase().includes(lower)
      : p.cpf.toLowerCase().startsWith(lower)
  );

  setPatients(filtered);
}

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

        <div className="patient-search">
          <input
            type="text"
            className="search-input"
            placeholder={`Buscar por ${searchType === 'name' ? 'nome' : 'CPF'}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <select
            className="search-select"
            value={searchType}
            onChange={(e) => {
              const type = e.target.value as 'name' | 'cpf';
              setSearchType(type);
            }}
          >
            <option value="name">Nome</option>
            <option value="cpf">CPF</option>
          </select>

          <button
            className="search-button"
            onClick={() => applyFilter(searchTerm, searchType)}
          >
            Buscar
          </button>
        </div>


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
