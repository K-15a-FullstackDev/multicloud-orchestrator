import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

export default function Costs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["costs"],
    queryFn: async () => (await api.get("/costs")).data,
    refetchInterval: 60_000,
  });

  if (isLoading) return <p>Loading cost data...</p>;
  if (error) return <p className="text-red-600">Error loading costs</p>;

  const datasets = (data || [])
    .filter((r) => !r.error)
    .map((r) => ({
      label: r.provider.toUpperCase(),
      data: r.points.map((p) => p.amount),
      borderColor: r.provider === "aws" ? "rgb(255,99,132)" : "rgb(54,162,235)",
      fill: false,
    }));
  const labels = (data[0]?.points || []).map((p) => p.date);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Cloud Costs (Last 7 Days)</h1>
      <div className="bg-white p-4 rounded shadow">
        <Line data={{ labels, datasets }} />
      </div>
    </div>
  );
}
