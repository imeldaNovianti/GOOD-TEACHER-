import { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Laporan() {
  const [dataGuru, setDataGuru] = useState([]);
  const laporanRef = useRef();

  // Ambil data dari backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kuisioner-jawaban/statistik/guru")
      .then((res) => setDataGuru(res.data))
      .catch((err) => console.error("❌ Error fetch laporan:", err));
  }, []);

  // Data chart
  const chartData = {
    labels: dataGuru.map((g) => g.guru ?? "Unknown"),
    datasets: [
      {
        label: "Rata-rata Skor",
        data: dataGuru.map((g) => g.rataRata ?? 0),
        backgroundColor: "#991b1b", // ganti ke hex untuk html2canvas
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Rata-rata Skor Per Guru" },
    },
  };

  // Fungsi export PDF
  const downloadPDF = () => {
    const input = laporanRef.current;
    html2canvas(input, { scale: 2, useCORS: true, willReadFrequently: true }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("laporan-guru.pdf");
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

      <div
        ref={laporanRef}
        style={{ backgroundColor: "#ffffff" }}
        className="p-6 shadow rounded space-y-6"
      >
        {/* Grafik */}
        <Bar data={chartData} options={chartOptions} />

        {/* Tabel */}
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
