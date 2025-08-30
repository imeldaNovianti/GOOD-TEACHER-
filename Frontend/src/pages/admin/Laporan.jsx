import { useEffect, useState, useRef } from "react"; // Mengimpor hook dari React
import { Bar } from "react-chartjs-2"; // Mengimpor komponen Bar untuk membuat chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Mengimpor library chart.js dan plugin yang dibutuhkan untuk chart
import jsPDF from "jspdf"; // Mengimpor jsPDF untuk membuat dan mengunduh PDF
import html2canvas from "html2canvas"; // Mengimpor html2canvas untuk mengubah elemen HTML menjadi gambar
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP request

// Registrasi plugin yang diperlukan untuk ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Laporan() {
  const [dataGuru, setDataGuru] = useState([]); // State untuk menyimpan data guru
  const laporanRef = useRef(); // Referensi untuk elemen yang akan dipindai untuk PDF

  // Ambil data dari backend dengan axios saat komponen pertama kali dimuat
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kuisioner-jawaban/statistik/guru") // Mengambil data statistik guru
      .then((res) => setDataGuru(res.data)) // Menyimpan data yang diterima dari backend ke dalam state
      .catch((err) => console.error("❌ Error fetch laporan:", err)); // Menangani error jika terjadi
  }, []); // Empty array memastikan hanya dijalankan sekali saat mount

  // Menyiapkan data untuk chart
  const chartData = {
    labels: dataGuru.map((g) => g.guru ?? "Unknown"), // Nama guru sebagai label
    datasets: [
      {
        label: "Rata-rata Skor", // Label untuk dataset
        data: dataGuru.map((g) => g.rataRata ?? 0), // Data untuk rata-rata skor setiap guru
        backgroundColor: "#991b1b", // Warna latar belakang untuk grafik
      },
    ],
  };

  // Opsi konfigurasi untuk chart
  const chartOptions = {
    responsive: true, // Membuat chart responsif terhadap ukuran layar
    plugins: {
      legend: { position: "top" }, // Posisi legenda di atas chart
      title: { display: true, text: "Rata-rata Skor Per Guru" }, // Judul chart
    },
  };

  // Fungsi untuk mengekspor halaman sebagai PDF
  const downloadPDF = () => {
    const input = laporanRef.current; // Mengambil referensi elemen yang akan dipindai
    html2canvas(input, { scale: 2, useCORS: true, willReadFrequently: true }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Mengonversi canvas menjadi data URL
        const pdf = new jsPDF("p", "mm", "a4"); // Membuat file PDF baru
        const pdfWidth = pdf.internal.pageSize.getWidth(); // Mengambil lebar halaman PDF
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Menghitung tinggi PDF agar sesuai dengan rasio gambar
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Menambahkan gambar ke PDF
        pdf.save("laporan-guru.pdf"); // Menyimpan file PDF dengan nama "laporan-guru.pdf"
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 style={{ color: "#991b1b" }} className="text-2xl font-bold">
        📊 Laporan
      </h2>
      <p className="text-gray-700">
        Admin bisa melihat rekap skor guru dan download laporan dalam bentuk PDF.
      </p>

      {/* Div yang berisi elemen yang akan dipindai menjadi gambar untuk PDF */}
      <div
        ref={laporanRef}
        style={{ backgroundColor: "#ffffff" }}
        className="p-6 shadow rounded space-y-6"
      >
        {/* Grafik Bar */}
        <Bar data={chartData} options={chartOptions} />

        {/* Tabel dengan data guru */}
        <div className="overflow-x-auto">
          <table className="w-full border mt-6">
            <thead style={{ backgroundColor: "#991b1b", color: "#ffffff" }}>
              <tr>
                <th className="p-2 border">Nama Guru</th>
                <th className="p-2 border">Mata Pelajaran</th>
                <th className="p-2 border">Rata-rata Skor</th>
              </tr>
            </thead>
            <tbody>
              {/* Menampilkan data guru */}
              {dataGuru.length > 0 ? (
                dataGuru.map((g, index) => (
                  <tr
                    key={`${g.guru}-${g.mapel}-${index}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2 border">{g.guru ?? "-"}</td>
                    <td className="p-2 border">{g.mapel ?? "-"}</td>
                    <td className="p-2 border text-center">{g.rataRata ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tombol untuk mengunduh laporan dalam format PDF */}
      <button
        onClick={downloadPDF}
        className="px-5 py-2 bg-[#991b1b] text-white rounded hover:bg-[#7a1414] transition"
      >
        ⬇️ Download PDF
      </button>
    </div>
  );
}

export default Laporan;
