// ChartDashboard.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,   // ⬅️ penting
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Daftarkan komponen Chart.js yang mau dipakai
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartDashboard() {
  const data = {
    labels: ["Januari", "Februari", "Maret", "April"],
    datasets: [
      {
        label: "Jumlah Kuisioner",
        data: [10, 20, 15, 30],
        backgroundColor: "rgba(220,38,38,0.7)", // merah
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Statistik Kuisioner" },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Dashboard Statistik</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartDashboard;
