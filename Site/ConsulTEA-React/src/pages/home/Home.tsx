import "./Home.css";
import Header from "../../components/header/Header";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <main className="flex-grow w-full px-4 py-16 text-center">
        <div>
        <h2 className="text-4xl font-bold mb-4 text-blue-700">
          Compreendendo o Autismo com Cuidado e Tecnologia
        </h2>
        

        <p className="text-lg mb-8">
          Uma plataforma para profissionais registrarem anamneses e acompanharem
          o desenvolvimento de pessoas com TEA, unindo empatia e tecnologia.
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
        © 2025 Projeto TEA Data
      </footer>
    </div>
  );
}
