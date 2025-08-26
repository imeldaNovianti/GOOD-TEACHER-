import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function IsiKuisioner() {
  const { guruId } = useParams();
  const navigate = useNavigate();
  const siswaId = parseInt(localStorage.getItem("siswaId"));

  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [guru, setGuru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sudahIsi, setSudahIsi] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "📚 Belajar adalah investasi terbaik untuk masa depan.",
    "🌟 Setiap jawabanmu adalah cahaya bagi pendidikan.",
    "🚀 Pendidikan membuka jalan menuju kesuksesan.",
    "🤝 Penilaianmu membantu guru menjadi lebih baik.",
  ];

  // Rotate quotes tiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!siswaId || isNaN(siswaId)) {
      alert("❌ Siswa belum login!");
      navigate("/login");
      return;
    }

    fetch(
      `http://localhost:8080/api/kuisioner-jawaban/cek?siswaId=${siswaId}&guruId=${guruId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.sudahIsi) {
          setSudahIsi(true);
          setLoading(false);
        } else {
          Promise.all([
            fetch(`http://localhost:8080/api/guru-mapel/${guruId}`).then((res) =>
              res.json()
            ),
            fetch("http://localhost:8080/api/pertanyaan").then((res) =>
              res.json()
            ),
          ])
            .then(([guruData, pertanyaanData]) => {
              setGuru(guruData);
              setPertanyaan(pertanyaanData);
              setLoading(false);
            })
            .catch((err) => {
              console.error("❌ Error fetch pertanyaan/guru:", err);
              setLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error("❌ Error cek kuisioner:", err);
        setLoading(false);
      });
  }, [guruId, siswaId, navigate]);

  // Handle input
  const handleChange = (id, value) => {
    setJawaban({ ...jawaban, [id]: value });
  };

  // Submit
  const handleSubmit = () => {
    const belumDiisi = pertanyaan.filter((p) => !jawaban[p.id]);
    if (belumDiisi.length > 0) {
      alert("⚠️ Masih ada pertanyaan yang belum diisi!");
      return;
    }

    const payload = pertanyaan.map((p) => ({
      siswa: { id: siswaId },
      guruMapel: { id: parseInt(guruId) },
      pertanyaan: { id: p.id },
      jawaban: p.tipeJawaban === "SKALA" ? Number(jawaban[p.id]) : jawaban[p.id],
    }));

    setSubmitting(true);
    fetch("http://localhost:8080/api/kuisioner-jawaban/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal simpan jawaban");
        return res.text();
      })
      .then((msg) => {
        alert("✅ " + msg);
        navigate("/siswa/kuisioner");
      })
      .catch((err) => {
        console.error("❌ Error submit:", err);
        alert("❌ Gagal menyimpan kuisioner, coba lagi!");
      })
      .finally(() => setSubmitting(false));
  };

  // UI Loading
  if (loading)
    return <p className="p-6 animate-pulse text-center">⏳ Loading...</p>;

  // UI Sudah Diisi
  if (sudahIsi) {
    return (
      <motion.div
        className="max-w-md mx-auto mt-20 p-8 bg-gradient-to-r from-red-700 via-yellow-100 to-red-700 rounded-3xl shadow-2xl border-2 border-red-400 text-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-300 rounded-full opacity-30 animate-pulse blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 animate-pulse blur-3xl"></div>

        <motion.h2
          className="text-2xl md:text-3xl font-extrabold text-red-800 mb-4 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          ⚠️ Kuisioner Sudah Pernah Diisi
        </motion.h2>

        <motion.p
          className="text-gray-900 mb-6 text-sm md:text-base"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Anda sudah mengisi kuisioner untuk guru ini. Terima kasih atas
          partisipasi Anda 🙏
        </motion.p>

        <motion.button
          onClick={() => navigate("/siswa/kuisioner")}
          className="mt-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅️ Kembali
        </motion.button>

        <motion.div
          className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 font-semibold animate-pulse shadow-inner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          💡 Tip: Jangan lupa mengisi kuisioner guru lainnya untuk membantu kualitas pendidikan!
        </motion.div>
      </motion.div>
    );
  }

  // Hitung progress
  const total = pertanyaan.length;
  const terisi = Object.keys(jawaban).length;
  const progress = Math.round((terisi / total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white p-8 relative overflow-hidden">
      {/* Background aurora */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-200 via-yellow-200 to-pink-200 animate-pulse opacity-30"></div>

      {/* Hero */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-3xl font-extrabold mb-3 text-red-700"
          style={{
            textShadow:
              "0 0 10px rgba(255,0,0,0.6), 0 0 18px rgba(255,215,0,0.7)",
          }}
        >
          Penilaian Guru: Suaramu Penting 🚀
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kuisioner ini akan membantu meningkatkan kualitas pembelajaran.
          Jawabanmu sangat berarti 🙌
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Kuisioner */}
        <motion.div
          className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold text-gray-700 mb-6">
            Kuisioner untuk{" "}
            <span className="text-red-600">{guru?.namaGuru}</span>{" "}
            <span className="text-gray-500">({guru?.mataPelajaran})</span>
          </h2>

          {/* Progress Circle */}
          <div className="flex items-center justify-center my-6">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="url(#grad1)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * progress) / 100}
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * progress) / 100 }}
                  transition={{ duration: 0.6 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="red" />
                    <stop offset="100%" stopColor="gold" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-gray-700">
                {progress}%
              </span>
            </div>
          </div>

          {pertanyaan.map((p) => (
            <motion.div
              key={p.id}
              className="mb-6 p-5 border rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
              whileHover={{
                boxShadow:
                  "0 0 12px rgba(255,0,0,0.4), 0 0 20px rgba(255,215,0,0.6)",
              }}
            >
              <p className="font-medium text-gray-800">{p.teks}</p>

              {p.tipeJawaban === "SKALA" ? (
                <div className="flex gap-4 mt-3 justify-center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <label
                      key={num}
                      className={`flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition ${
                        jawaban[p.id] === num
                          ? "bg-gradient-to-r from-red-500 to-yellow-400 text-white shadow-lg"
                          : "hover:bg-red-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${p.id}`}
                        value={num}
                        checked={jawaban[p.id] === num}
                        onChange={() => handleChange(p.id, num)}
                        className="hidden"
                      />
                      <span className="text-2xl">
                        {["😡", "😐", "🙂", "😍", "🤩"][num - 1]}
                      </span>
                      <span className="text-xs mt-1">{num}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full border rounded-lg p-3 mt-3 focus:ring-2 focus:ring-red-400"
                  rows="3"
                  value={jawaban[p.id] || ""}
                  onChange={(e) => handleChange(p.id, e.target.value)}
                  placeholder="Tulis jawaban Anda..."
                />
              )}
            </motion.div>
          ))}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/siswa/kuisioner")}
              className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow"
            >
              ⬅️ Kembali
            </button>
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-6 py-2 rounded-lg font-semibold shadow ${
                submitting
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-yellow-500 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {submitting ? "Menyimpan..." : "✅ Simpan Jawaban"}
            </motion.button>
          </div>
        </motion.div>

        {/* Sidebar Guru */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-center text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guru?.namaGuru}`}
            alt="avatar guru"
            className="w-24 h-24 rounded-full mb-4 shadow"
          />
          <h3 className="text-lg font-bold text-gray-800">{guru?.namaGuru}</h3>
          <p className="text-sm text-gray-500">{guru?.mataPelajaran}</p>
          <hr className="my-4 w-full border-gray-200" />
          <p className="text-sm text-gray-600 italic">
            “Setiap jawabanmu adalah kontribusi besar untuk pendidikan.”
          </p>
          <div className="mt-4 bg-yellow-100 px-3 py-2 rounded-lg text-sm text-yellow-800 shadow-inner">
            ⭐ Guru ini telah dinilai oleh <span className="font-bold">42 siswa</span>
          </div>
        </motion.div>
      </div>

      {/* Motivasi */}
      <motion.div
        className="max-w-4xl mx-auto mt-12 text-center bg-gradient-to-r from-yellow-100 to-red-100 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h4 className="text-lg font-bold text-gray-700 mb-2">
          Terima kasih sudah berpartisipasi 🙏
        </h4>
        <motion.p
          key={quoteIndex}
          className="text-sm text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {quotes[quoteIndex]}
        </motion.p>
      </motion.div>
    </div>
  );
}

export default IsiKuisioner;
