import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import function langsung

function Kuisioner() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data kuisioner dari backend
  useEffect(() => {
    fetch("http://localhost:8080/api/kuisioner-jawaban")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data kuisioner");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetch:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">⏳ Loading data kuisioner...</p>;

  // Fungsi download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Judul PDF
    doc.setFontSize(18);
    doc.setTextColor(128, 0, 0); // maroon manual untuk PDF
    doc.text("📋 Laporan Data Kuisioner", 14, 20);

    // Kolom tabel
    const tableColumn = [
      "Siswa",
      "Guru",
      "Mapel",
      "Pertanyaan",
      "Jawaban",
      "Tanggal",
    ];
    const tableRows = [];

    // Isi tabel
    data.forEach((item) => {
      const rowData = [
        item.siswa?.nama || "-",
        item.guruMapel?.namaGuru || "-",
        item.guruMapel?.mataPelajaran || "-",
        item.pertanyaan?.teks || "-",
        item.jawaban,
        new Date(item.createdAt).toLocaleString("id-ID"),
      ];
      tableRows.push(rowData);
    });

    // Buat tabel PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10, halign: "center" },
      headStyles: {
        fillColor: [128, 0, 0], // maroon
        textColor: [255, 255, 255],
        halign: "center",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Simpan file PDF
    doc.save("laporan-kuisioner.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-red-700">
            📋 Data Kuisioner
          </h2>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            ⬇️ Download PDF
          </button>
        </div>

        {/* Content */}
        {data.length === 0 ? (
          <p className="text-gray-600">Belum ada data kuisioner.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-700 text-white text-left">
                  <th className="p-3 border">Siswa</th>
                  <th className="p-3 border">Guru</th>
                  <th className="p-3 border">Mapel</th>
                  <th className="p-3 border">Pertanyaan</th>
                  <th className="p-3 border">Jawaban</th>
                  <th className="p-3 border">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="p-3 border">{item.siswa?.nama}</td>
                    <td className="p-3 border">{item.guruMapel?.namaGuru}</td>
                    <td className="p-3 border">
                      {item.guruMapel?.mataPelajaran}
                    </td>
                    <td className="p-3 border">{item.pertanyaan?.teks}</td>
                    <td className="p-3 border text-center font-semibold text-red-700">
                      {item.jawaban}
                    </td>
                    <td className="p-3 border text-gray-600">
                      {new Date(item.createdAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kuisioner;
