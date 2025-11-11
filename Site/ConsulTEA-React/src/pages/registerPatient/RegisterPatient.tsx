// RegisterPatient.tsx (refactored)
import './RegisterPatient.css';
import { useState } from 'react';

export default function RegisterPatient() {
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    birth: '',
    contact: '',
    guardian: '',
    guardianContact: '',
    createdAt: ''
  });

 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert('Paciente registrado com sucesso! (mock)');
  };

  const apiRegister = async (name: string, birthdate: string, cpf: string, contact: string, guardian: string, guardianContact: string) => {
    const time = new Date();
    const currentTime = time.toISOString();
    const res = await fetch("https://localhost:52467/Patient/post/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Birthdate: birthdate, Cpf: cpf,Contact: contact, Guardian: guardian, GuardianContact: guardianContact, CreatedAt: currentTime }),
    });
    if (!res.ok) throw new Error("Register failed");
    return res.json();
};

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault(); /* 
        setError(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        } */
        setLoading(true);
        try {
            const res = await apiRegister(form.name, form.birth, form.cpf.trim(), form.contact, form.guardian, form.guardianContact);
        } catch (err: any) {
            setError(err?.message ?? "register failed");
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md w-full">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">TEA Data</h1>
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
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-xl p-10 w-full max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
            Cadastrar Paciente
          </h2>

          <div className="space-y-5">
            {[
              { label: 'Nome completo', name: 'name' },
              { label: 'CPF', name: 'cpf' },
              {
                label: 'Data de Nascimento',
                name: 'birth',
                type: 'date',
              },
              { label: 'Contato', name: 'contact' },
              { label: 'Nome do guardião (se menor)', name: 'guardian' },
              { label: 'Contato do guardião', name: 'guardianContact' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-semibold mb-1 text-blue-900">
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  required={field.name !== 'guardian' && field.name !== 'guartianContact'}
                  className="form-input"
                   style={{ color: 'black' }}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-8 bg-blue-600 text-white w-full py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Registrar Paciente
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

