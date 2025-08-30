// ChartDashboard.jsx // nama file komponen untuk menampilkan chart

import React from "react"; // import React untuk membuat komponen
import { Bar } from "react-chartjs-2"; // import komponen chart Bar dari react-chartjs-2 (wrapper Chart.js)
import { // import modul/modul Chart.js yang diperlukan agar grafik bisa bekerja
  Chart as ChartJS, // alias ChartJS supaya tidak bentrok dengan nama Chart lain
  CategoryScale,   // ⬅️ skala kategori (untuk sumbu X: label bulan, dsb.)
  LinearScale,     // skala linear (untuk sumbu Y: angka)
  BarElement,      // elemen batang (bar chart)
  Title,           // plugin untuk judul chart
  Tooltip,         // plugin tooltip saat hover
  Legend,          // plugin legenda chart
} from "chart.js";

// Daftarkan komponen Chart.js yang mau dipakai
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); 
// wajib register semua modul agar chart bisa ditampilkan (tanpa ini error)

function ChartDashboard() { // definisi komponen ChartDashboard
  const data = { // data chart
    labels: ["Januari", "Februari", "Maret", "April"], // label sumbu X (bulan)
    datasets: [ // kumpulan dataset grafik
      {
        label: "Jumlah Kuisioner", // nama dataset (muncul di legend)
        data: [10, 20, 15, 30], // nilai tiap bulan (Y axis)
        backgroundColor: "rgba(220,38,38,0.7)", // warna batang grafik (merah transparan)
      },
    ],
  };

  const options = { // konfigurasi chart
    responsive: true, // agar chart otomatis menyesuaikan ukuran layar
    plugins: { // konfigurasi plugin
      legend: { position: "top" }, // posisi legend di atas chart
      title: { display: true, text: "Statistik Kuisioner" }, // judul chart
    },
  };

  return ( // JSX untuk render UI
    <div className="p-4 bg-white rounded-lg shadow-md"> 
      {/* container chart dengan padding, background putih, rounded, shadow */}
      <h2 className="text-xl font-bold mb-4">Dashboard Statistik</h2> 
      {/* judul bagian chart */}
      <Bar data={data} options={options} /> 
      {/* komponen Bar chart dari react-chartjs-2 dengan data & options */}
    </div>
  );
}

export default ChartDashboard; // export komponen agar bisa dipakai di file lain
