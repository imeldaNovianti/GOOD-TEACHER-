import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";

function HasilKuisioner() {
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);

  const siswaId = parseInt(localStorage.getItem("siswaId"));

  useEffect(() => {
    if (!siswaId) {
      console.warn("⚠️ Siswa belum login!");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/kuisioner-jawaban/siswa/${siswaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch hasil kuisioner");
        return res.json();
      })
      .then((data) => {
        setHasil(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetch hasil:", err);
        setLoading(false);
      });
  }, [siswaId]);

  if (loading) return <p className="p-6 animate-pulse">⏳ Memuat hasil...</p>;

  if (!siswaId) {
    return (
      <p className="p-6 text-red-600 font-semibold">
        ⚠️ Silakan login terlebih dahulu untuk melihat hasil kuisioner.
      </p>
    );
  }

  // ====== Data Statistik ======
  const totalIsi = hasil.length;
  const guruUnik = new Set(hasil.map((h) => h.guruMapel?.id)).size;

  // rata-rata skala (hanya ambil jawaban numerik)
  const skala = hasil
    .map((h) => (typeof h.jawaban === "number" ? h.jawaban : null))
    .filter((v) => v !== null);

  const avg =
    skala.length > 0
      ? (skala.reduce((a, b) => a + b, 0) / skala.length).toFixed(2)
      : 0;

  // Data grafik pie (jumlah jawaban per skor 1-5)
  const distribusi = [1, 2, 3, 4, 5].map((n) => ({
    name: `Skor ${n}`,
    value: skala.filter((v) => v === n).length,
  }));

  const COLORS = ["#d90429", "#ef233c", "#f77f00", "#fcbf49", "#ffdd00"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-3 flex items-center justify-center gap-2">
          📊 Hasil Kuisioner Anda
        </h1>
        <p className="text-gray-600">
          Terima kasih sudah berpartisipasi! Berikut adalah rangkuman kontribusi
          Anda dalam menilai guru. ✨
        </p>
      </motion.div>

      {/* Statistik Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg p-6 rounded-xl border-t-4 border-red-500 text-center"
        >
          <h3 className="text-gray-500">Total Kuisioner</h3>
          <p className="text-3xl font-bold text-red-600">{totalIsi}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg p-6 rounded-xl border-t-4 border-yellow-500 text-center"
        >
          <h3 className="text-gray-500">Guru Dinilai</h3>
          <p className="text-3xl font-bold text-yellow-600">{guruUnik}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg p-6 rounded-xl border-t-4 border-green-500 text-center"
        >
          <h3 className="text-gray-500">Rata-rata Skor</h3>
          <p className="text-3xl font-bold text-green-600">{avg}</p>
        </motion.div>
      </div>

      {/* Grafik */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-12">
        {/* Pie Chart */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow border"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Distribusi Jawaban Skala
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribusi}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribusi.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow border"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">
            Rata-rata Skor per Guru
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.values(
                hasil.reduce((acc, h) => {
                  if (typeof h.jawaban === "number") {
                    const guru = h.guruMapel?.namaGuru;
                    if (!acc[guru]) acc[guru] = { guru, total: 0, count: 0 };
                    acc[guru].total += h.jawaban;
                    acc[guru].count += 1;
                  }
                  return acc;
                }, {})
              ).map((g) => ({
                guru: g.guru,
                avg: g.total / g.count,
              }))}
            >
              <XAxis dataKey="guru" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#f77f00" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabel Detail */}
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 border">
        <h2 className="text-xl font-bold mb-4 text-red-700">
          Detail Jawaban Kuisioner
        </h2>
        {hasil.length === 0 ? (
          <p className="text-gray-600 italic">
            Belum ada jawaban kuisioner yang tersimpan.
          </p>
        ) : (
          <div className="overflow-x-auto rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-3 border">Guru</th>
                  <th className="p-3 border">Mapel</th>
                  <th className="p-3 border">Pertanyaan</th>
                  <th className="p-3 border">Jawaban</th>
                  <th className="p-3 border">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-yellow-50 transition`}
                  >
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

      {/* Motivasi Footer */}
      <motion.div
        className="max-w-4xl mx-auto mt-12 text-center bg-gradient-to-r from-yellow-100 to-red-100 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h4 className="text-lg font-bold text-gray-700 mb-2">
          🎉 Teruslah berkontribusi!
        </h4>
        <p className="text-sm text-gray-600">
          Setiap jawabanmu membawa perubahan positif untuk masa depan sekolah.
          🌟
        </p>
      </motion.div>
    </div>
  );
}

export default HasilKuisioner;
