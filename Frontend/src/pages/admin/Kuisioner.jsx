import { useEffect, useState } from "react"; // Mengimpor hook useEffect dan useState dari React
import jsPDF from "jspdf"; // Mengimpor pustaka jsPDF untuk membuat PDF
import autoTable from "jspdf-autotable"; // Mengimpor pustaka autoTable untuk membuat tabel dalam PDF

function Kuisioner() {
  const [data, setData] = useState([]); // State untuk menyimpan data kuisioner yang diambil dari backend
  const [loading, setLoading] = useState(true); // State untuk menandakan apakah data sedang dimuat atau tidak

  // Ambil data kuisioner dari backend menggunakan useEffect
  useEffect(() => {
    fetch("http://localhost:8080/api/kuisioner-jawaban") // Mengambil data kuisioner dari endpoint backend
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data kuisioner"); // Jika respons gagal, munculkan error
        return res.json(); // Parse respons menjadi JSON
      })
      .then((result) => {
        setData(result); // Simpan data hasil fetch ke dalam state `data`
        setLoading(false); // Set loading menjadi false setelah data berhasil diambil
      })
      .catch((err) => {
        console.error("❌ Error fetch:", err); // Menampilkan pesan error jika fetch gagal
        setLoading(false); // Set loading menjadi false walaupun terjadi error
      });
  }, []); // Efek ini hanya dijalankan sekali ketika komponen pertama kali dimuat

  // Jika data masih dimuat, tampilkan pesan loading
  if (loading) return <p className="p-6">⏳ Loading data kuisioner...</p>;

  // Fungsi untuk mengunduh laporan dalam bentuk PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF(); // Membuat instance baru dari jsPDF

    // Menetapkan judul PDF
    doc.setFontSize(18); // Mengatur ukuran font menjadi 18px
    doc.setTextColor(128, 0, 0); // Mengatur warna teks menjadi maroon
    doc.text("📋 Laporan Data Kuisioner", 14, 20); // Menambahkan teks judul ke PDF

    // Menyusun kolom tabel
    const tableColumn = [
      "Siswa", // Kolom untuk nama siswa
      "Guru", // Kolom untuk nama guru
      "Mapel", // Kolom untuk mata pelajaran
      "Pertanyaan", // Kolom untuk teks pertanyaan
      "Jawaban", // Kolom untuk jawaban
      "Tanggal", // Kolom untuk tanggal pengisian
    ];
    const tableRows = []; // Array untuk menyimpan baris-baris data yang akan dimasukkan ke tabel

    // Memasukkan data kuisioner ke dalam tabel
    data.forEach((item) => {
      const rowData = [
        item.siswa?.nama || "-", // Nama siswa, jika tidak ada nama tampilkan "-"
        item.guruMapel?.namaGuru || "-", // Nama guru, jika tidak ada tampilkan "-"
        item.guruMapel?.mataPelajaran || "-", // Nama mata pelajaran, jika tidak ada tampilkan "-"
        item.pertanyaan?.teks || "-", // Teks pertanyaan, jika tidak ada tampilkan "-"
        item.jawaban, // Jawaban yang diberikan
        new Date(item.createdAt).toLocaleString("id-ID"), // Mengubah tanggal ke format yang sesuai dengan Indonesia
      ];
      tableRows.push(rowData); // Menambahkan baris data ke array tableRows
    });

    // Membuat tabel pada PDF dengan autoTable
    autoTable(doc, {
      head: [tableColumn], // Menentukan header tabel
      body: tableRows, // Menentukan isi tabel
      startY: 30, // Menentukan posisi tabel pada halaman
      styles: { fontSize: 10, halign: "center" }, // Mengatur gaya teks tabel
      headStyles: {
        fillColor: [128, 0, 0], // Warna latar belakang header tabel (maroon)
        textColor: [255, 255, 255], // Warna teks header tabel (putih)
        halign: "center", // Menyelaraskan teks header ke tengah
      },
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Menambahkan warna latar belakang berbeda pada baris tabel yang bergantian
    });

    // Menyimpan file PDF dengan nama "laporan-kuisioner.pdf"
    doc.save("laporan-kuisioner.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6"> {/* Container utama dengan padding */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6"> {/* Wrapper untuk konten */}
        {/* Header */}
        <div className="flex items-center justify-between mb-6"> {/* Header dengan flexbox */}
          <h2 className="text-3xl font-extrabold text-red-700"> {/* Judul halaman */}
            📋 Data Kuisioner
          </h2>
          {/* Tombol untuk download PDF */}
          <button
            onClick={handleDownloadPDF} // Ketika tombol diklik, panggil fungsi handleDownloadPDF
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            ⬇️ Download PDF
          </button>
        </div>

        {/* Konten utama */}
        {data.length === 0 ? (
          <p className="text-gray-600">Belum ada data kuisioner.</p> // Jika tidak ada data, tampilkan pesan
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow"> {/* Tabel dengan scroll horizontal */}
            <table className="w-full text-sm"> {/* Tabel dengan lebar penuh dan ukuran font kecil */}
              <thead>
                <tr className="bg-red-700 text-white text-left"> {/* Header tabel */}
                  <th className="p-3 border">Siswa</th>
                  <th className="p-3 border">Guru</th>
                  <th className="p-3 border">Mapel</th>
                  <th className="p-3 border">Pertanyaan</th>
                  <th className="p-3 border">Jawaban</th>
                  <th className="p-3 border">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {/* Mengiterasi data untuk menampilkan setiap item dalam tabel */}
                {data.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`} // Menambahkan warna baris bergantian dan efek hover
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
