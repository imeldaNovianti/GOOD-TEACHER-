import { useEffect, useState, useRef } from "react";
import { MessageSquare, Users, FileText, EyeOff, Download, Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

function AdminFeedbackPage() {
  // State untuk menyimpan data feedback dari API
  const [feedbacks, setFeedbacks] = useState([]);
  // State untuk menyimpan nilai pencarian
  const [search, setSearch] = useState("");
  // State untuk menyimpan jenis filter yang aktif
  const [filter, setFilter] = useState("ALL");
  // State untuk mengontrol tampilan modal konfirmasi export
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  // State untuk menyimpan status export (null, 'success', 'error')
  const [exportStatus, setExportStatus] = useState(null);
  // State untuk menandai sedang loading data
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menentukan chart yang aktif ('pie' atau 'bar')
  const [activeChart, setActiveChart] = useState("pie");

  // useEffect untuk mengambil data feedback saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading menjadi true
        const response = await fetch("http://localhost:8080/api/feedback"); // Fetch data dari API
        const data = await response.json(); // Parse response ke JSON
        setFeedbacks(data); // Set data ke state feedbacks
      } catch (err) {
        console.error("❌ Error fetch feedback:", err); // Log error jika fetch gagal
        setExportStatus('error'); // Set status export menjadi error
      } finally {
        setIsLoading(false); // Set loading menjadi false setelah selesai
      }
    };

    fetchData(); // Panggil fungsi fetchData
  }, []); // Empty dependency array, hanya dijalankan sekali saat mount

  // Menghitung total feedback
  const total = feedbacks.length;
  // Menghitung jumlah feedback dengan jenis SARAN
  const saran = feedbacks.filter((f) => f.type === "SARAN").length;
  // Menghitung jumlah feedback dengan jenis UCAPAN
  const ucapan = feedbacks.filter((f) => f.type === "UCAPAN").length;
  // Menghitung jumlah feedback anonim
  const anonim = feedbacks.filter((f) => f.anonim).length;
  // Menghitung jumlah feedback non-anonim
  const nonAnonim = total - anonim;

  // Filter feedback berdasarkan nilai pencarian dan filter
  const filtered = feedbacks.filter((f) => {
    // Cek apakah konten atau judul feedback mengandung kata kunci pencarian
    const matchSearch =
      f.content?.toLowerCase().includes(search.toLowerCase()) ||
      f.title?.toLowerCase().includes(search.toLowerCase());
    // Cek apakah feedback sesuai dengan filter yang dipilih
    const matchFilter =
      filter === "ALL" ? true : 
      filter === "ANONIM" ? f.anonim : 
      f.type === filter;
    return matchSearch && matchFilter; // Mengembalikan feedback yang sesuai dengan kedua kondisi
  });

  // Data untuk pie chart
  const chartData = {
    labels: ["Saran", "Ucapan", "Anonim", "Non-Anonim"], // Label untuk chart
    datasets: [
      {
        data: [saran, ucapan, anonim, nonAnonim], // Data untuk chart
        backgroundColor: ["#22c55e", "#a855f7", "#ef4444", "#3b82f6"], // Warna background
        borderColor: "white", // Warna border
        borderWidth: 2 // Lebar border
      },
    ],
  };

  // Data untuk bar chart
  const barChartData = {
    labels: ["Saran", "Ucapan", "Anonim", "Non-Anonim"], // Label untuk chart
    datasets: [
      {
        label: "Jumlah Feedback", // Label untuk dataset
        data: [saran, ucapan, anonim, nonAnonim], // Data untuk chart
        backgroundColor: ["#22c55e", "#a855f7", "#ef4444", "#3b82f6"], // Warna background
        borderColor: "white", // Warna border
        borderWidth: 1 // Lebar border
      },
    ],
  };

  // Opsi untuk konfigurasi chart
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom', // Posisi legend
        labels: {
          padding: 20, // Padding untuk label
          usePointStyle: true, // Menggunakan point style
          pointStyle: 'circle' // Bentuk point
        }
      }
    },
    maintainAspectRatio: false // Tidak mempertahankan aspect ratio
  };

  // Fungsi untuk mengekspor data ke PDF
  const exportPDF = () => {
    setShowExportConfirm(false); // Tutup modal konfirmasi
    setExportStatus('processing'); // Set status export menjadi processing
    
    try {
      const doc = new jsPDF(); // Membuat instance jsPDF
      
      // Header dengan gradient
      doc.setFillColor(220, 53, 69); // Set warna fill
      doc.rect(0, 0, 220, 30, 'F'); // Gambar rectangle
      doc.setFontSize(18); // Set ukuran font
      doc.setTextColor(255, 255, 255); // Set warna text
      doc.text("LAPORAN FEEDBACK SISWA", 105, 15, { align: 'center' }); // Tambahkan text
      
      // Info laporan
      doc.setFillColor(245, 245, 245); // Set warna fill
      doc.rect(0, 30, 220, 15, 'F'); // Gambar rectangle
      doc.setFontSize(10); // Set ukuran font
      doc.setTextColor(0, 0, 0); // Set warna text
      doc.text(`Total Feedback: ${total} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 38); // Tambahkan text
      
      // Tabel data menggunakan autoTable
      autoTable(doc, {
        startY: 45, // Posisi mulai tabel
        head: [["ID", "User", "Jenis", "Judul", "Isi", "Tanggal"]], // Header tabel
        body: filtered.map((f) => [ // Body tabel
          f.id, // ID feedback
          f.anonim ? "Anonim" : `User-${f.userId}`, // User info
          f.type || "-", // Jenis feedback
          f.title || "-", // Judul feedback
          f.content.length > 50 ? f.content.substring(0, 50) + "..." : f.content || "-", // Konten feedback (dipotong jika terlalu panjang)
          new Date(f.createdAt).toLocaleString("id-ID"), // Tanggal dibuat
        ]),
        theme: 'grid', // Tema tabel
        headStyles: {
          fillColor: [79, 70, 229], // Warna fill header
          textColor: 255 // Warna text header
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240] // Warna fill baris alternatif
        }
      });
      
      // Footer untuk setiap halaman
      const pageCount = doc.internal.getNumberOfPages(); // Mendapatkan jumlah halaman
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Set halaman aktif
        doc.setFontSize(10); // Set ukuran font
        doc.setTextColor(100, 100, 100); // Set warna text
        doc.text(`Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' }); // Tambahkan text footer
      }

      // Simulasikan proses yang memakan waktu dengan setTimeout
      setTimeout(() => {
        doc.save("Laporan_Feedback_Siswa.pdf"); // Simpan PDF
        setExportStatus('success'); // Set status export menjadi success
        
        // Reset status setelah 3 detik
        setTimeout(() => setExportStatus(null), 3000);
      }, 1500);
    } catch (error) {
      console.error("Error generating PDF:", error); // Log error
      setExportStatus('error'); // Set status export menjadi error
      
      // Reset status setelah 3 detik
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  // Fungsi untuk memformat angka dengan pemisah ribuan
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-700 text-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">📋 Manajemen Feedback</h2>
          <p className="text-white/90 mt-1 text-sm md:text-base">
            Kelola semua saran & ucapan dari siswa dengan mudah
          </p>
        </div>
        
        {/* Tombol Export PDF */}
        <button
          onClick={() => setShowExportConfirm(true)}
          className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition transform hover:scale-105"
        >
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* Modal Konfirmasi Export */}
      {showExportConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-500 w-8 h-8" />
              <h3 className="text-xl font-semibold">Export Laporan</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Anda akan mengekspor {filtered.length} data feedback ke dalam format PDF. Apakah Anda yakin ingin melanjutkan?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExportConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <Download size={16} /> Ya, Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi Status Export */}
      {exportStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn ${exportStatus === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : exportStatus === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
          {exportStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>PDF berhasil diunduh!</span>
            </>
          ) : exportStatus === 'error' ? (
            <>
              <XCircle className="w-5 h-5" />
              <span>Terjadi kesalahan saat mengekspor</span>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span>Sedang memproses PDF...</span>
            </>
          )}
        </div>
      )}

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white shadow-lg p-5 rounded-2xl border-l-4 border-blue-500 transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(total)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageSquare className="text-blue-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`${total > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {total > 0 ? '↑' : ''} Semua masukan dari siswa
            </span>
          </div>
        </div>

        <div className="bg-white shadow-lg p-5 rounded-2xl border-l-4 border-green-500 transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Saran</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(saran)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`${saran > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {saran > 0 ? `${((saran / total) * 100).toFixed(1)}% dari total` : 'Belum ada saran'}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-lg p-5 rounded-2xl border-l-4 border-purple-500 transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ucapan</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(ucapan)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`${ucapan > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {ucapan > 0 ? `${((ucapan / total) * 100).toFixed(1)}% dari total` : 'Belum ada ucapan'}
            </span>
          </div>
        </div>

        <div className="bg-white shadow-lg p-5 rounded-2xl border-l-4 border-red-500 transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Anonim</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(anonim)}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <EyeOff className="text-red-600 w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`${anonim > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {anonim > 0 ? `${((anonim / total) * 100).toFixed(1)}% dari total` : 'Tidak ada anonim'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-lg p-6 rounded-2xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">📊 Visualisasi Data Feedback</h3>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveChart('pie')}
              className={`px-3 py-1 rounded-md text-sm ${activeChart === 'pie' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Pie Chart
            </button>
            <button 
              onClick={() => setActiveChart('bar')}
              className={`px-3 py-1 rounded-md text-sm ${activeChart === 'bar' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Bar Chart
            </button>
          </div>
        </div>
        
        <div className="h-80">
          {activeChart === 'pie' ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <Bar data={barChartData} options={chartOptions} />
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <span className="block text-2xl font-bold text-green-700">{formatNumber(saran)}</span>
            <span className="text-sm text-green-600">Saran</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <span className="block text-2xl font-bold text-purple-700">{formatNumber(ucapan)}</span>
            <span className="text-sm text-purple-600">Ucapan</span>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <span className="block text-2xl font-bold text-red-700">{formatNumber(anonim)}</span>
            <span className="text-sm text-red-600">Anonim</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <span className="block text-2xl font-bold text-blue-700">{formatNumber(nonAnonim)}</span>
            <span className="text-sm text-blue-600">Non-Anonim</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white shadow-lg p-5 rounded-2xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari feedback berdasarkan judul atau isi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-red-300 focus:border-transparent"
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-red-300 focus:border-transparent appearance-none"
            >
              <option value="ALL">Semua Feedback</option>
              <option value="SARAN">Saran</option>
              <option value="UCAPAN">Ucapan</option>
              <option value="ANONIM">Anonim</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filtered.length}</span> dari <span className="font-semibold">{total}</span> feedback
          </p>
          
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      </div>

      {/* Tabel Feedback */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">ID</th>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">User</th>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">Jenis</th>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">Judul</th>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">Isi</th>
                <th className="p-4 text-left font-semibold text-sm uppercase text-gray-600">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? ( // Tampilkan loading state
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Memuat data feedback...</p>
                  </td>
                </tr>
              ) : filtered.length > 0 ? ( // Tampilkan data jika ada
                filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-red-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">#{f.id}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${f.anonim ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        {f.anonim ? "Anonim" : `User-${f.userId}`}
                      </div>
                    </td>
                    <td className="p-4">
                      {f.type === "SARAN" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          SARAN
                        </span>
                      ) : f.type === "UCAPAN" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          UCAPAN
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 font-medium">{f.title || "-"}</td>
                    <td className="p-4 max-w-xs">
                      <div className="line-clamp-2">{f.content || "-"}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(f.createdAt).toLocaleDateString("id-ID", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : ( // Tampilkan state tidak ada data
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-8867280-7265556.png"
                        alt="No data"
                        className="w-40 h-40 opacity-70"
                      />
                      <p className="mt-4 text-gray-500 font-medium">Tidak ada feedback yang ditemukan</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {search ? `Coba kata kunci lain atau hapus pencarian` : `Semua feedback telah difilter`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Sistem Feedback Sekolah. Data diperbarui secara real-time.</p>
      </div>
    </div>
  );
}

export default AdminFeedbackPage;