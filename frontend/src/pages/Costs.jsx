import { Line } from "react-chartjs-2";
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
  const labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const data = {
    labels,
    datasets: [
      { label: "AWS (USD)", data: [1, 1.6, 2.4, 3.3, 4.1, 4.7] },
      { label: "Azure (USD)", data: [0.8, 1.4, 2.0, 2.6, 3.1, 3.6] },
    ],
  };
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Costs (Preview)</h1>
      <div className="bg-white p-4 rounded shadow">
        <Line data={data} />
      </div>
      <p className="text-sm text-gray-600">
        This is mocked. This will pull real data from AWS Cost Explorer and
        Azure Consumption.
      </p>
    </div>
  );
}
