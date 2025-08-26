import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function KuisionerList() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/guru-mapel")
      .then((res) => res.json())
      .then((data) => {
        setGuruList(data);
        setLoading(false);
      })
      .catch((err) => console.error("❌ Error fetch guru", err));
  }, []);

  if (loading) return <p className="p-6 animate-pulse">⏳ Loading...</p>;

  // Filter & search
  const filtered = guruList.filter((g) => {
    const cocokSearch = g.namaGuru.toLowerCase().includes(search.toLowerCase());
    const cocokFilter = filter === "all" || g.mataPelajaran === filter;
    return cocokSearch && cocokFilter;
  });

  // Ambil list mata pelajaran unik
  const mapelList = [...new Set(guruList.map((g) => g.mataPelajaran))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white p-8">
      {/* Hero Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-3 flex items-center justify-center gap-2 text-red-700"
          style={{
            textShadow:
              "0 0 8px rgba(255,0,0,0.6), 0 0 15px rgba(255,215,0,0.7)",
          }}
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            📋
          </motion.span>
          Pilih Guru untuk Dinilai
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Suara Anda membantu meningkatkan kualitas pembelajaran. Pilih guru
          yang ingin Anda isi kuisioner, lalu berikan penilaian terbaik ✨
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <input
          type="text"
          placeholder="🔍 Cari guru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg p-3 shadow focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
          style={{
            boxShadow:
              search.length > 0
                ? "0 0 12px rgba(255,0,0,0.6), 0 0 20px rgba(255,215,0,0.8)"
                : "none",
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-3 shadow focus:ring-2 focus:ring-red-400 transition-all"
          style={{
            boxShadow:
              filter !== "all"
                ? "0 0 12px rgba(255,0,0,0.6), 0 0 20px rgba(255,215,0,0.8)"
                : "none",
          }}
        >
          <option value="all">Semua Mapel</option>
          {mapelList.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Progress Info */}
      <motion.div
        className="max-w-5xl mx-auto mb-8 bg-white p-4 rounded-xl shadow flex items-center justify-between"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          boxShadow:
            "0 0 8px rgba(255,0,0,0.3), 0 0 16px rgba(255,215,0,0.5)",
        }}
      >
        <p className="text-gray-700 font-medium">
          Total Guru: <span className="font-bold">{guruList.length}</span>
        </p>
        <p className="text-gray-700 font-medium">
          Ditampilkan: <span className="font-bold">{filtered.length}</span>
        </p>
      </motion.div>

      {/* Guru Cards */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((guru) => (
            <motion.div
              key={guru.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition transform"
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 15px rgba(255,0,0,0.6), 0 0 25px rgba(255,215,0,0.8)",
              }}
              whileTap={{
                scale: 0.97,
                boxShadow:
                  "0 0 20px rgba(255,0,0,0.8), 0 0 35px rgba(255,215,0,1)",
              }}
            >
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl mb-4">
                👨‍🏫
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {guru.namaGuru}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {guru.mataPelajaran}
              </p>
              <motion.button
                onClick={() => navigate(`/siswa/kuisioner/${guru.id}`)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                whileHover={{
                  boxShadow:
                    "0 0 12px rgba(255,0,0,0.7), 0 0 20px rgba(255,215,0,0.9)",
                }}
                whileTap={{
                  scale: 0.95,
                  boxShadow:
                    "0 0 20px rgba(255,0,0,0.9), 0 0 35px rgba(255,215,0,1)",
                }}
              >
                ✏️ Isi Kuisioner
              </motion.button>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 italic">
            Tidak ada guru ditemukan.
          </p>
        )}
      </motion.div>

      {/* Sidebar Motivasi */}
      <motion.div
        className="max-w-4xl mx-auto mt-12 text-center bg-gradient-to-r from-yellow-100 to-red-100 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          boxShadow:
            "0 0 12px rgba(255,0,0,0.4), 0 0 22px rgba(255,215,0,0.7)",
        }}
      >
        <h4 className="text-lg font-bold text-gray-700 mb-2">
          “Menilai guru bukan sekadar kewajiban, tapi kontribusi untuk masa depan.”
        </h4>
        <p className="text-sm text-gray-600">
          Dengan mengisi kuisioner ini, kamu ikut serta dalam meningkatkan mutu
          pembelajaran di sekolah 🌟
        </p>
      </motion.div>
    </div>
  );
}

export default KuisionerList;
