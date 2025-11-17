// RegisterPatient.tsx (refactored)
import './RegisterDoctor.css';
import { useState } from 'react';

export default function RegisterDoctor() {
  const [formData, setFormData] = useState({
    name: '',
    crm: '',
    cpf: '',
    specialty: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert('Médico registrado com sucesso! (mock)');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md w-full">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">ConsulTEA</h1>
          <nav className="flex space-x-8 text-lg font-semibold">
            <a href="/home" className="hover:underline">Início</a>
            <a href="#" className="hover:underline">Pacientes</a>
            <a href="#" className="hover:underline">Sair</a>
          </nav>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-grow w-full flex justify-center py-16 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Cadastrar Médico
          </h2>

          <div className="space-y-5">
            {[
                { label: 'Nome completo', name: 'nome', type: 'text' },
                { label: 'CRM', name: 'crm', type: 'text' },
                { label: 'CPF', name: 'cpf', type: 'text' }, 
                { label: 'Especialidade', name: 'specialty', type: 'text' },
                { label: 'e-mail', name: 'email', type: 'email' },
                { label: 'Senha', name: 'password', type: 'password' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-semibold mb-1 text-blue-900">
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white w-full py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Registrar Doutor
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

