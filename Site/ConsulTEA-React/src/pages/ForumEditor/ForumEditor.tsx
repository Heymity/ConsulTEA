import { useState } from "react";
import "./ForumEditor.css"

interface DataSeries {
  [key: string]: string[];
}

interface Section {
  type: number;
  text: string;
  imageUri: string;
  graphType: number;
  sectionOrder: number;
  dataSeries: DataSeries;
}

export default function ForumEditor() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        type: 0,
        text: "",
        imageUri: "",
        graphType: 0,
        sectionOrder: prev.length + 1,
        dataSeries: {}
      }
    ]);
  };

  const updateSection = (index: number, field: string, value: any) => {
    setSections(prev => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      sections,
    };

    console.log("Payload enviado:", payload);

    const res = await fetch("http://localhost:5000/Forum/Post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Erro ao publicar");
      return;
    }

    alert("Publicação criada!");
    window.location.href = "/section-selection-page"
  };

  return (
    <div className="page-container">
        <div className="content-box">

    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="nova-publicacao">Criar nova publicação</h1>

      {/* Título */}
      <label className="titulo">Título</label>
      <input
        type="text"
        className="search-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Seções */}
      {/* <h2 className="text-xl font-semibold mt-6 mb-3">Seções</h2> */}

      {sections.map((sec, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Seção {index + 1}</h3>

          {/* Texto */}
          <label className="block mb-1">Texto</label>
          <textarea
            className="border p-2 w-full mb-3"
            
            value={sec.text}
            onChange={(e) => updateSection(index, "text", e.target.value)}
          />

          {/* Campo imagem */}
          <label className="block mb-1">URL da imagem (opcional)</label>
          <input
            type="text"
            className="border p-2 w-full mb-3"
            value={sec.imageUri}
            onChange={(e) => updateSection(index, "imageUri", e.target.value)}
          />

          {/* Tipo do gráfico */}
          {(
            <>
              <label className="block mb-1">Tipo de gráfico</label>
              <input
                type="number"
                className="border p-2 w-full mb-3"
                value={sec.graphType}
                onChange={(e) =>
                  updateSection(index, "graphType", Number(e.target.value))
                }
              />
            </>
          )}
        </div>
      ))}

      <button
        onClick={addSection}
        className="nova-secao"
      >
        + Adicionar seção
      </button>

      <hr className="my-6" />

      <button
        onClick={handleSubmit}
        className="bt"
      >
        Publicar
      </button>

        <button
        className="bt"
        onClick={() => { window.location.href = "/section-selection-page"; }}
        >
            Voltar
        </button>
    </div>
    </div>
    </div>
  );
}
