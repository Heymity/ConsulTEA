import './Home.css';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold">TEA Data</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Início</a>
            <a href="#" className="hover:underline">Sobre</a>
            <a href="#" className="hover:underline">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow w-full px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-700">
          Compreendendo o Autismo com Cuidado e Tecnologia
        </h2>
        <p className="text-lg mb-8">
          Uma plataforma para profissionais registrarem anamneses e acompanharem
          o desenvolvimento de pessoas com TEA, unindo empatia e ciência.
        </p>
        <a
          href="#"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Acessar painel de especialista
        </a>
      </main>

      {/* Features */}
        <section>
        <div className="container">
            {[
            { icon: "🧠", title: "Armazenamento clínico", desc: "Registre anamneses e observações de forma segura." },
            { icon: "📊", title: "Visualização de dados", desc: "Veja padrões e tendências clínicas de forma clara." },
            { icon: "🔒", title: "Segurança de dados", desc: "Todos os registros são protegidos e criptografados." },
            { icon: "🩺", title: "Foco no profissional", desc: "Ferramenta pensada para otimizar o trabalho de especialistas." },
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
        © 2025 Projeto TEA Data — Ainda em Desenvolvimento lol 
      </footer>
    </div>
  );
}
