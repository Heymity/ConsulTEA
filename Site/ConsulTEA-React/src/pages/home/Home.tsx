import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se existe token no localStorage ou sessionStorage
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role");

    if (token) setIsLoggedIn(true);
    if (role) setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="w-full flex justify-between items-center px-8">
          <h1 className="text-2xl font-bold">ConsulTEA</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:underline">Início</a>
            <a href="/autism-info" className="hover:underline">Dados</a>

            {!isLoggedIn ? (
              <a href="/login" className="hover:underline">Login</a>
            ) : (
              <>
                <a href="/register-patient" className="hover:underline">
                  Cadastro de Paciente
                </a>

                {/* Mostra o botão de cadastrar médico apenas para admins */}
                {userRole === "admin" && (
                  <a href="/register-doctor" className="hover:underline">
                    Cadastrar Médico
                  </a>
                )}

                <button onClick={handleLogout} className="hover:underline">
                  Sair
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full px-4 py-16 text-center">
        <div>
        <h2 className="text-4xl font-bold mb-4 text-blue-700">
          Compreendendo o Autismo com Cuidado e Tecnologia
        </h2>
        

        <p className="text-lg mb-8">
          Uma plataforma para profissionais registrarem anamneses e acompanharem
          o desenvolvimento de pessoas com TEA, unindo empatia e ciência.
        </p>

        {/* {!isLoggedIn ? (
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Acessar painel de especialista
          </a>
        ) : (
          <a
            href="/register-patient"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Cadastrar novo paciente
          </a>
        )} */}
        </div>
      </main>

      {/* Features */}
      <section>
        <div className="container">
          {[
            { icon: "🧠", title: "Armazenamento clínico", desc: "Registre anamneses e observações de forma segura." },
            { icon: "📊", title: "Visualização de dados", desc: "Veja padrões e tendências clínicas de forma clara." },
            { icon: "🩺", title: "Foco no profissional", desc: "Ferramenta pensada para auxiliar o trabalho de especialistas." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Ainda em Desenvolvimento
      </footer>
    </div>
  );
}
