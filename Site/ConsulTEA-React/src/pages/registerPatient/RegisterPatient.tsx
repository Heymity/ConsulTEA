// RegisterPatient.tsx (refactored)
import Header from '../../components/header/Header';
import './RegisterPatient.css';
import { useState } from 'react';

export default function RegisterPatient() {
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    birth: '',
    contact: '',
    guardian: '',
    guardianContact: ''
  });

 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const apiRegister = async (name: string, birthdate: string, cpf: string, contact: string, guardian: string, guardianContact: string) => {
    const token = localStorage.getItem("auth_token");
    try {const res = await fetch("http://localhost:5000/Patient/new", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Birthdate: birthdate, Cpf: cpf,ContactPhone: contact, GuardianName: guardian, GuardianContact: guardianContact}),
    });
    if (!res.ok) throw new Error("Register failed");
    return res.json();}
    finally {setLoading(false)}
    
};

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault(); 
        setLoading(true);
        try {
            const result = await apiRegister(form.name, form.birth, form.cpf.trim(), form.contact, form.guardian, form.guardianContact);
            console.log('Registration successful:', result);
        } catch (err: any) {
            setError(err?.message ?? "register failed");
            console.log('Registration failed', error)
        } finally {
            setLoading(false);
            window.location.href = "/see-patients";
        }
    };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-blue-50">
      {/* Header */}
      <Header/>

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
                  required={field.name !== 'guardian' && field.name !== 'guardianContact'}
                  className="form-input"
                   style={{ color: 'black' }}
                  disabled={loading}
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

