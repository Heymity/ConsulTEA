import Header from "../../components/header/Header";
import "./SeeAppointment.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SeeAppointment() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`http://localhost:5000/Appointment/get/Appointment/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Erro ao carregar anamnese.");

        const data = await res.json();
        setAppointment(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [id]);

  if (loading) return <p className="loading">Carregando...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!appointment) return <p>Registro não encontrado.</p>;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      <Header />

      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <div className="appointment-card">
          <h2 className="title">{new Date(appointment.date).toLocaleDateString("pt-BR")}</h2>

          <div className="section">
            <h3>Queixa Principal</h3>
            <p>{appointment.mainComplaint || "-"}</p>
          </div>

          <div className="section">
            <h3>Observação Comportamental</h3>
            <p>{appointment.behaviorObservation || "-"}</p>
          </div>

          <div className="section">
            <h3>Comunicação</h3>
            <p>{appointment.communicationNotes || "-"}</p>
          </div>

          <div className="section">
            <h3>Sensório</h3>
            <p>{appointment.sensoryNotes || "-"}</p>
          </div>

          <div className="section">
            <h3>Interação Social</h3>
            <p>{appointment.socialInteraction || "-"}</p>
          </div>

          <div className="section">
            <h3>Medicação em Uso</h3>
            <p>{appointment.medicationInUse || "-"}</p>
          </div>

          <div className="section">
            <h3>Evolução</h3>
            <p>{appointment.evolutionSummary || "-"}</p>
          </div>

          <div className="section">
            <h3>Próximos Passos</h3>
            <p>{appointment.nextSteps || "-"}</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
