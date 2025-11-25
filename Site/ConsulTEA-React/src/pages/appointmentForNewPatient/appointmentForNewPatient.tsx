// appointmentForNewPatient.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import "./appointmentForNewPatient.css";

interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
}

export default function AppointmentForNewPatient() {
  const [cpf, setCpf] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function searchPatient() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const token = localStorage.getItem("auth_token");

      const url = `http://localhost:5000/Patient/get/cpf/${cpf}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar paciente");
      }

      const data = await res.json();

      if (data.length === 0) {
        setError("Nenhum paciente encontrado.");
        return;
      }

      if (data.length === 1) {
        navigate("/add-appointment", { state: { patientId: data[0].id } });
        return;
      }

      // Se vierem múltiplos resultados
      setResults(data);

    } catch (e) {
      console.error(e);
      setError("Falha na consulta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function selectPatient(id: number) {
    navigate("/add-appointment", { state: { patientId: id } });
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 font-sans text-gray-800">
      <Header />

      <main className="flex-grow flex justify-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl">

          <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
            Nova anamnese
          </h2>

          {/* Barra de pesquisa */}
          <div className="patient-search">
            <input
              type="text"
              className="search-input"
              placeholder="Digite o CPF..."
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <button className="search-button" onClick={searchPatient}>
              Buscar
            </button>
          </div>

          {loading && <p>Carregando...</p>}
          {error && <p className="error-text">{error}</p>}

          {results.length > 1 && (
            <ul className="results-list">
              {results.map((p) => (
                <li key={p.id} className="result-card" onClick={() => selectPatient(p.id)}>
                  <p className="result-name">{p.name}</p>
                  <p className="result-info"><strong>CPF:</strong> {p.cpf}</p>
                  <p className="result-info"><strong>Nasc.:</strong> {p.birthDate}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
