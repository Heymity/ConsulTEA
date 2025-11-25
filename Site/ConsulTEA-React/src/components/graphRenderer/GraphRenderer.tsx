import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type GraphRendererProps = {
  type: number; // 0: Line, 1: Bar, 2: Scatter
  dataSeries: {
    x: Number[] | string[];
    y: Number[];
  };
};

export default function GraphRenderer({ type, dataSeries }: GraphRendererProps) {
  if (!dataSeries || !dataSeries.x || !dataSeries.y) return null;

  const xArr = dataSeries.x;
  const yArr = dataSeries.y.map(Number);

  const chartData = xArr.map((x, i) => ({
    x,
    y: yArr[i] ?? null,
  }));

  switch (type) {
    case 0:
      return (
        <LineChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
        </LineChart>
      );

    case 1:
      return (
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#82ca9d" />
        </BarChart>
      );

    case 2:
      return (
        <ScatterChart width={500} height={300}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" />
          <YAxis type="number" dataKey="y" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={chartData} fill="#ff7300" />
        </ScatterChart>
      );

    default:
      return <p>Tipo de gráfico não suportado.</p>;
  }
}
