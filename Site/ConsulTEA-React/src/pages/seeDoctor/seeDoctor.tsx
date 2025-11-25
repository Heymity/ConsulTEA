// SeeDoctor.tsx
import Header from '../../components/header/Header';
import './SeeDoctor.css';
import { useEffect, useState } from 'react';

interface Doctor {
  id: number;
  name: string;
  cpf: string;
  crm: string;
  specialty: string;
  email: string;
}

export default function SeeDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsOriginal, setDoctorsOriginal] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDoctor, setExpandedDoctor] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'cpf'>('name');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);

        const token = localStorage.getItem("auth_token");
        const url = "http://localhost:5000/Doctor/list";

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar médicos");
        }

        const data = await res.json();

        const mappedDoctors: Doctor[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          cpf: d.cpf,
          crm: d.crm,
          specialty: d.specialty,
          email: d.email,
        }));

        setDoctors(mappedDoctors);
        setDoctorsOriginal(mappedDoctors);

      } catch (err) {
        console.error(err);
        setError("Erro ao carregar médicos.");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedDoctor(prev => prev === id ? null : id);
  };

  function applyFilter(term: string, type: 'name' | 'cpf') {
    if (!term.trim()) {
      setDoctors(doctorsOriginal);
      return;
    }

    const lower = term.toLowerCase();

    const filtered = doctorsOriginal.filter(d =>
      type === 'name'
        ? d.name.toLowerCase().includes(lower)
        : d.cpf.toLowerCase().startsWith(lower)
    );

    setDoctors(filtered);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">

      <Header/>

      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl">

          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Médicos
          </h2>

          {/* Search Bar */}
          <div className="doctor-search">
            <input
              type="text"
              className="search-input"
              placeholder={`Buscar por ${searchType === 'name' ? 'nome' : 'CPF'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="search-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'cpf')}
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

          {loading && <p>Carregando médicos...</p>}
          {error && <p className="error-text">{error}</p>}

          <ul className="doctor-list">
            {doctors.map((d) => (
              <li key={d.id} className="doctor-card">

                <div
                  className="doctor-summary"
                  onClick={() => toggleExpand(d.id)}
                >
                  <p className="doctor-name">{d.name}</p>
                  <p className="doctor-info"><strong>CPF:</strong> {d.cpf}</p>
                  <p className="doctor-info"><strong>CRM:</strong> {d.crm}</p>
                </div>

                {expandedDoctor === d.id && (
                  <div className="doctor-dropdown">
                    <p className="doctor-info"><strong>Especialidade:</strong> {d.specialty}</p>
                    <p className="doctor-info"><strong>Email:</strong> {d.email}</p>
                  </div>
                )}

              </li>
            ))}
          </ul>

        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
