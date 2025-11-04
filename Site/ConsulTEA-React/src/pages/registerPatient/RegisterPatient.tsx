import './RegisterPatient.css';
import { useState } from 'react';

export default function RegisterPatient() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    contato: '',
    guardiao: '',
    contatoGuardiao: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Paciente registrado com sucesso! (mock)");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold">TEA Data</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Início</a>
            <a href="#" className="hover:underline">Pacientes</a>
            <a href="#" className="hover:underline">Sair</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full px-4 py-12 flex justify-center items-start bg-gradient-to-br from-blue-100 to-blue-50">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Cadastrar Paciente</h2>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nome completo</label>
              <input name="nome" value={formData.nome} onChange={handleChange} required className="form-input"/>
            </div>

            <div>
              <label className="block font-semibold mb-1">CPF</label>
              <input name="cpf" value={formData.cpf} onChange={handleChange} required className="form-input"/>
            </div>

            <div>
              <label className="block font-semibold mb-1">Data de Nascimento</label>
              <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} required className="form-input"/>
            </div>

            <div>
              <label className="block font-semibold mb-1">Contato</label>
              <input name="contato" value={formData.contato} onChange={handleChange} required className="form-input"/>
            </div>

            <div>
              <label className="block font-semibold mb-1">Nome do guardião (se menor)</label>
              <input name="guardiao" value={formData.guardiao} onChange={handleChange} className="form-input"/>
            </div>

            <div>
              <label className="block font-semibold mb-1">Contato do guardião</label>
              <input name="contatoGuardiao" value={formData.contatoGuardiao} onChange={handleChange} className="form-input"/>
            </div>
          </div>

          <button type="submit" className="mt-6 bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Registrar Paciente
          </button>
        </form>
      </main>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 Projeto TEA Data — Em desenvolvimento
      </footer>
    </div>
  );
}
