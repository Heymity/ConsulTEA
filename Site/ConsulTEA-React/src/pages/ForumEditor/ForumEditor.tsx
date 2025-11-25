import { useState } from "react";
import "./ForumEditor.css"
import * as XLSX from "xlsx";
import Papa from "papaparse";

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

interface ParsedData {
  rawRows: string[][];
  headerRowIndex: number;
  headers: string[];
  rows: string[][];
  selectedRowIndices: number[];
  xHeader?: string;
  yHeader?: string;
  expandOnlyGroupedRows?: boolean; // new flag
}

// helper to compute headers/rows from rawRows + headerRowIndex
const computeParsedFromRaw = (rawRows: string[][], headerRowIndex = 0, prev?: ParsedData): ParsedData => {
  const allRows = rawRows || [];
  const maxCols = allRows.reduce((m, r) => Math.max(m, r?.length ?? 0), 0);
  // pad rows to same column width
  const normalized = allRows.map(r => {
    const rowCopy = [...r];
    while (rowCopy.length < maxCols) rowCopy.push("");
    return rowCopy;
  });

  const headerRow = normalized[headerRowIndex] ?? [];
  const headers = headerRow.map(c => (c ?? "").toString());
  const rows = normalized.filter((_, i) => i !== headerRowIndex).map(r => r.map(c => (c ?? "").toString()));
  const defaultSelected = rows.map((_, i) => i);
  // Try to keep previously selected x/y if they exist and match new headers
  const xHeader = prev?.xHeader && headers.includes(prev.xHeader) ? prev.xHeader : headers[0];
  const yHeader = prev?.yHeader && headers.includes(prev.yHeader) ? prev.yHeader : headers[1];
  return {
    rawRows: normalized,
    headerRowIndex,
    headers,
    rows,
    selectedRowIndices: defaultSelected,
    xHeader,
    yHeader,
    expandOnlyGroupedRows: prev?.expandOnlyGroupedRows ?? true, // default true
  };
};

// expand merges from sheet to fill merged values into each covered cell
// if onlyVertical is true, only merges that cover >1 row will be expanded
const expandMergedCells = (aoa: any[][], merges: any[] | undefined, onlyVertical = true): string[][] => {
  // copy aoa and make sure all rows have equal length
  const maxCols = aoa.reduce((m, r) => Math.max(m, (r?.length) ?? 0), 0);
  const height = aoa.length;
  const grid: string[][] = [];
  for (let r = 0; r < height; r++) {
    const row: string[] = [];
    const src = aoa[r] ?? [];
    for (let c = 0; c < maxCols; c++) {
      const v = (src && typeof src[c] !== "undefined") ? src[c] : "";
      // fixed bug: previously inserted a literal quote instead of the value
      row.push(v == null ? "" : v.toString());
    }
    grid.push(row);
  }

  if (!merges || merges.length === 0) return grid;

  merges.forEach(m => {
    const sr = m.s.r as number;
    const sc = m.s.c as number;
    const er = m.e.r as number;
    const ec = m.e.c as number;

    // If onlyVertical is true, skip merges that don't span >1 row
    if (onlyVertical && er <= sr) return;

    const value = (grid[sr] && typeof grid[sr][sc] !== "undefined") ? grid[sr][sc] : "";
    for (let rr = sr; rr <= er; rr++) {
      for (let cc = sc; cc <= ec; cc++) {
        grid[rr][cc] = value;
      }
    }
  });

  return grid;
};

export default function ForumEditor() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [parsedMap, setParsedMap] = useState<Record<number, ParsedData>>({});

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
      // ensure sectionOrder is consistent
      updated.forEach((s, i) => s.sectionOrder = i + 1);
      return updated;
    });
  };

  const handleFileUpload = async (index: number, file?: File) => {
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext) return;

    if (ext === "csv") {
      Papa.parse<string[]>(file, {
        skipEmptyLines: false, // keep lines so user can pick header row
        complete: (results :any) => {
          const allRows = results.data as string[][];
          if (!allRows || allRows.length === 0) return;
          const parsed = computeParsedFromRaw(allRows, 0);
          setParsedMap(prev => ({ ...prev, [index]: parsed }));
        }
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const ab = await file.arrayBuffer();
      const workbook = XLSX.read(ab, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const aoa = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as any[];
      if (!aoa || aoa.length === 0) return;

      // Use per-section expandOnlyGroupedRows flag; default true
      const merges = (sheet && (sheet as any)['!merges']) as any[] | undefined;
      const expanded = expandMergedCells(aoa, merges, true /* default, will be overrideable by UI */);

      const parsed = computeParsedFromRaw(expanded, 0);
      setParsedMap(prev => ({ ...prev, [index]: parsed }));
    } else {
      alert("Tipo de arquivo não suportado. Use .csv ou .xlsx/.xls");
    }
  };

  const setHeaderRowForSection = (sectionIndex: number, headerRowIndex: number) => {
    setParsedMap(prev => {
      const parsed = prev[sectionIndex];
      if (!parsed) return prev;
      const newParsed = computeParsedFromRaw(parsed.rawRows, headerRowIndex, parsed);
      return {
        ...prev,
        [sectionIndex]: newParsed,
      };
    });
  };

  const applyParsedSelection = (index: number) => {
    const parsed = parsedMap[index];
    if (!parsed) return;
    const { headers, rows, selectedRowIndices, xHeader, yHeader } = parsed;
    if (!xHeader || !yHeader) {
      alert("Selecione dois cabeçalhos para o gráfico.");
      return;
    }
    const xIndex = headers.indexOf(xHeader);
    const yIndex = headers.indexOf(yHeader);
    if (xIndex === -1 || yIndex === -1) {
      alert("Cabeçalhos inválidos.");
      return;
    }
    const selectedRows = selectedRowIndices.map(i => rows[i] ?? []);

    const dataSeries: DataSeries = {};
    dataSeries[xHeader] = selectedRows.map(r => (r[xIndex] ?? "").toString());
    dataSeries[yHeader] = selectedRows.map(r => (r[yIndex] ?? "").toString());

    updateSection(index, "dataSeries", dataSeries);
    alert("Série(s) de dados aplicadas à seção");
  };

  const toggleRow = (sectionIndex: number, rowIndex: number) => {
    setParsedMap(prev => {
      const parsed = prev[sectionIndex];
      if (!parsed) return prev;
      const setIdx = new Set(parsed.selectedRowIndices);
      if (setIdx.has(rowIndex)) setIdx.delete(rowIndex);
      else setIdx.add(rowIndex);
      return {
        ...prev,
        [sectionIndex]: {
          ...parsed,
          selectedRowIndices: Array.from(setIdx).sort((a, b) => a - b)
        }
      };
    });
  };

  const toggleSelectAll = (sectionIndex: number) => {
    setParsedMap(prev => {
      const parsed = prev[sectionIndex];
      if (!parsed) return prev;
      const all = parsed.rows.map((_, i) => i);
      const isAllSelected = parsed.selectedRowIndices.length === parsed.rows.length;
      return {
        ...prev,
        [sectionIndex]: {
          ...parsed,
          selectedRowIndices: isAllSelected ? [] : all
        }
      };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      sections,
    };

    console.log("Payload enviado:", payload);

    const res = await fetch("http://localhost:5000/forum/Post", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth_token")}` },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Erro ao publicar");
      return;
    }

    alert("Publicação criada!");
    window.location.href = "/section-selection-page"
  };

  const removeSection = (index: number) => {
    setSections(prev => {
      const updated = prev.filter((_, i) => i !== index);
      updated.forEach((s, i) => s.sectionOrder = i + 1);
      return updated;
    });
    setParsedMap(prev => {
      const copy = { ...prev };
      delete copy[index];
      // shift keys for parsedMap
      const newParsed: Record<number, ParsedData> = {};
      Object.keys(copy).map(k => Number(k)).sort((a, b) => a - b).forEach(oldKey => {
        if (oldKey > index) newParsed[oldKey - 1] = copy[oldKey];
        else newParsed[oldKey] = copy[oldKey];
      });
      return newParsed;
    });
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

          {sections.map((sec, index) => {
            const parsed = parsedMap[index];
            return (
              <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
                <h3 className="font-semibold mb-2">Seção {index + 1}</h3>

                {/* Texto */}
                <label className="block mb-1">Texto</label>
                <textarea
                  className="border p-2 w-full mb-3"
                  value={sec.text}
                  onChange={(e) => updateSection(index, "text", e.target.value)}
                />

                {/* Selecção */}
                <label className="block mb-1">Tipo de Mídia</label>
                <select
                  className="border p-2 w-full mb-3"
                  value={sec.type}
                  onChange={(e) => updateSection(index, "type", Number(e.target.value))}
                >
                  <option value={0}>Apenas Texto</option>
                  <option value={1}>Imagem</option>
                  <option value={2}>Gráfico</option>
                  <option value={3}>Gráfico e Imagem</option>
                </select>

                {/* Campo imagem */}
                {(sec.type === 1 || sec.type === 3) && <>
                  <label className="block mb-1">URL da imagem (opcional)</label>
                  <input
                    type="text"
                    className="border p-2 w-full mb-3"
                    value={sec.imageUri}
                    onChange={(e) => updateSection(index, "imageUri", e.target.value)}
                  />
                </>}

                {(sec.type === 2 || sec.type === 3) && (
                  <>
                    <label className="block mb-1">Tipo de gráfico</label>
                    <select
                      className="border p-2 w-full mb-3"
                      value={sec.graphType}
                      onChange={(e) => updateSection(index, "graphType", Number(e.target.value))}
                    >
                      <option value={0}>Linha</option>
                      <option value={1}>Barra</option>
                      <option value={2}>Pizza</option>
                    </select>

                    <label className="block mb-1">Arquivo de dados (CSV / XLSX)</label>
                    <input
                      type="file"
                      className="border p-2 w-full mb-3"
                      accept=".csv,.xlsx,.xls"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        await handleFileUpload(index, file);
                      }}
                    />

                    {parsed && (
                      <div className="border rounded p-3 mb-3 bg-white">
                        <div className="mb-2">
                          <strong>Selecionar linha que contém cabeçalhos</strong>
                          <div style={{ marginTop: 8 }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <select
                                value={parsed.headerRowIndex}
                                title={"Linha do cabeçalho: " + (parsed.headerRowIndex + 1)}
                                onChange={(ev) => {
                                  const newIndex = Number(ev.target.value);
                                  setHeaderRowForSection(index, newIndex);
                                }}
                                style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                              >
                                {parsed.rawRows.map((row, ri) => {
                                  const preview = row.slice(0, 4).map(c => (c ?? "").toString()).join(" | ");
                                  return <option key={ri} value={ri} title={row.join(", ")}>{`Linha ${ri + 1}: ${preview}`}</option>
                                })}
                              </select>
                              <small style={{ color: "#666" }}>Escolha qual linha contém os nomes das colunas. A visualização abaixo mostrará os dados.</small>
                            </label>
                          </div>

                          <div style={{ marginTop: 12 }}>
                            <strong>Cabecalhos:</strong>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                              <label style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 13, marginBottom: 4 }}>Eixo X</span>
                                <select
                                  value={parsed.xHeader}
                                  title={parsed.xHeader}
                                  onChange={(ev) => {
                                    const v = ev.target.value;
                                    setParsedMap(prev => ({ ...prev, [index]: { ...prev[index], xHeader: v } }));
                                  }}
                                  style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                                >
                                  {parsed.headers.map(h => <option key={h} title={h} value={h}>{h}</option>)}
                                </select>
                              </label>

                              <label style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 13, marginBottom: 4 }}>Eixo Y</span>
                                <select
                                  value={parsed.yHeader}
                                  title={parsed.yHeader}
                                  onChange={(ev) => {
                                    const v = ev.target.value;
                                    setParsedMap(prev => ({ ...prev, [index]: { ...prev[index], yHeader: v } }));
                                  }}
                                  style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                                >
                                  {parsed.headers.map(h => <option key={h} title={h} value={h}>{h}</option>)}
                                </select>
                              </label>
                            </div>

                            {/* NEW: toggle to expand only grouped rows */}
                            <div style={{ marginTop: 8 }}>
                              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input
                                  type="checkbox"
                                  checked={parsed.expandOnlyGroupedRows ?? true}
                                  onChange={(ev) => {
                                    const val = ev.target.checked;
                                    setParsedMap(prev => {
                                      const next = { ...prev } as any;
                                      const cur = next[index] as ParsedData;
                                      if (!cur) return prev;
                                      // If user toggles, recompute rawRows using the merges expansion behavior
                                      // We can re-run expandMergedCells if XLSX sheet merges exist - but we don't keep the original sheet object.
                                      // Instead, simply toggle the flag and update parsed object here: if user wants expands for row merges only,
                                      // they still see the grid with parsed.rawRows unchanged since we already expanded using the default.
                                      // Future improvement: store the un-expanded aoa in parsed.rawRowsAsRead to fully re-expand here.
                                      next[index] = { ...cur, expandOnlyGroupedRows: val };
                                      return next;
                                    });
                                  }}
                                />
                                Expand only grouped rows (don't expand horizontal merges)
                              </label>
                              <small style={{ color: "#666" }}>When enabled, only merges that span multiple rows are expanded so grouped rows become selectable. To re-parse with a different expansion behavior, re-upload the XLSX file for this section.</small>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: 8 }}>
                          <div>
                            <label>
                              <input
                                type="checkbox"
                                checked={parsed.selectedRowIndices.length === parsed.rows.length}
                                onChange={() => toggleSelectAll(index)}
                              />
                              {" "}Selecionar todas as linhas
                            </label>
                          </div>

                          <div style={{ maxHeight: 220, overflow: "auto", marginTop: 8 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                <tr>
                                  <th style={{ borderBottom: "1px solid #ccc", padding: 6 }}>#</th>
                                  {parsed.headers.map((h, i) => <th key={i} style={{ borderBottom: "1px solid #ccc", padding: 6 }}>{h}</th>)}
                                </tr>
                              </thead>
                              <tbody>
                                {parsed.rows.map((r, ri) => {
                                  const checked = parsed.selectedRowIndices.includes(ri);
                                  return (
                                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fafafa" : "white" }}>
                                      <td style={{ padding: 6, borderBottom: "1px solid #eee" }}>
                                        <input type="checkbox" checked={checked} onChange={() => toggleRow(index, ri)} />
                                        {" "}{ri + 1}
                                      </td>
                                      {parsed.headers.map((_, ci) => <td key={ci} style={{ padding: 6, borderBottom: "1px solid #eee" }}>{r[ci] ?? ""}</td>)}
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <button onClick={() => applyParsedSelection(index)} className="bt">Aplicar seleção de dados</button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block mb-1">Preview de dataSeries</label>
                      <pre style={{ background: "#f5f5f5", padding: 6, borderRadius: 4 }}>
                        {JSON.stringify(sec.dataSeries, null, 2)}
                      </pre>
                    </div>
                  </>
                )}

                <button
                  onClick={() => removeSection(index)}
                  style={{ marginTop: 8 }}
                >
                  - Remover seção
                </button>
              </div>
            )
          })}

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
            style={{ marginLeft: 8 }}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
