import React, { useState } from "react";
import "./uploadData.css";

const uploadData: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo CSV antes!");
      return;
    }

    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role");
    if (!token || role !== "admin") {
      alert("Você não está autenticado!");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/Data/upload-csv", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      alert("Arquivo enviado com sucesso!");

    } catch (err) {
      console.error(err);
      alert("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="csv-upload-container">

      <h2>Upload de Dados (CSV)</h2>
      <p>Envie aqui tabelas contendo dados sobre autismo para ser discutidos.</p>

      <div className="csv-card">
        <label className="csv-label">Selecione um arquivo CSV:</label>
        <input
          type="file"
          accept=".csv, .xlsx, .xls, .ods"
          onChange={handleFileChange}
        />

        {file && (
          <p className="filename">
            📄 Arquivo selecionado: <strong>{file.name}</strong>
          </p>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Enviando..." : "Fazer Upload"}
        </button>
      </div>

    <hr className="line"></hr>

    <button
      className="upload-btn"
      onClick={() => { window.location.href = "/autism-info"; }}
      disabled={uploading}
    >
        Voltar
    </button>

    </div>
  );
};

export default uploadData;
