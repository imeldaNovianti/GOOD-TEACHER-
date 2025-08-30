// Achievement.jsx
import { useState, useEffect, useMemo, useRef } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
import Confetti from "react-confetti"; 
import {PieChart,Pie,Cell,ResponsiveContainer,BarChart, Bar,XAxis,YAxis,Tooltip,  Legend} from "recharts"; // Import komponen chart dari recharts
import { toast, ToastContainer } from "react-toastify"; // Import notifikasi toast
import "react-toastify/dist/ReactToastify.css"; // Import stylesheet untuk toast
import { Trophy, MessageSquare, ThumbsUp, Star, Award, Gift, Heart, Zap, TrendingUp,Users,BookOpen,  Calendar,  BarChart3} from "lucide-react"; // Import icon dari lucide-react

const BASE_URL = "http://localhost:8080/api/feedback"; //  API feedback

const THEME_CLASSES = { // Objek untuk kelas CSS berdasarkan tema
  red: "bg-red-100 border-red-300",
  maroon: "bg-[#800020] bg-opacity-10 border-[#800020] border-opacity-30",
  pink: "bg-pink-100 border-pink-300",
  gold: "bg-amber-100 border-amber-300",
  crimson: "bg-[#DC143C] bg-opacity-10 border-[#DC143C] border-opacity-30"
};

const PIE_COLORS = ["#800020", "#DC143C", "#B22222", "#8B0000", "#CC5500"]; // Warna untuk chart pie

export default function Achievement() {
  // State untuk form feedback
  const [feedbackType, setFeedbackType] = useState("SARAN"); // State untuk jenis feedback (UCAPAN/SARAN)
  const [judul, setJudul] = useState(""); // State untuk judul saran
  const [isi, setIsi] = useState(""); // State untuk isi feedback
  const [anonim, setAnonim] = useState(false); // State untuk status anonim
  const [theme, setTheme] = useState("maroon"); // State untuk tema ucapan
  const [submitting, setSubmitting] = useState(false); // State untuk status pengiriman
  const [showConfetti, setShowConfetti] = useState(false); // State untuk menampilkan confetti

  // State untuk data feedback
  const [allFeedback, setAllFeedback] = useState([]); // State untuk semua feedback
  const [ucapanList, setUcapanList] = useState([]); // State untuk list ucapan
  const [saranList, setSaranList] = useState([]); // State untuk list saran
  const [stats, setStats] = useState({ // State untuk statistik feedback
    totalFeedback: 0,
    totalUcapan: 0,
    totalSaran: 0,
    topContributors: []
  });

  // State untuk UI
  const [selectedCard, setSelectedCard] = useState(null); // State untuk kartu yang dipilih
  const [loading, setLoading] = useState(true); // State untuk status loading
  const [activeTab, setActiveTab] = useState("feedback"); // State untuk tab aktif
  const [achievements, setAchievements] = useState([]); // State untuk achievements

  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null; // Parse data user dari localStorage
  const userId = user?.id ?? null; // Ambil user ID jika ada
  const username = user?.namaLengkap ?? user?.username ?? "Anda"; // Ambil username atau gunakan default

  // State untuk gamification
  const [submitCount, setSubmitCount] = useState(() => { // State untuk jumlah submit, diambil dari localStorage
    const raw = localStorage.getItem("gt_submit_count"); // Ambil data dari localStorage
    return raw ? Number(raw) : 0; // Kembalikan 0 jika tidak ada
  });

  const [windowSize, setWindowSize] = useState({ // State untuk ukuran window (untuk confetti)
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Daftar achievements yang telah ditentukan
  const ACHIEVEMENTS_LIST = [
    { id: 1, name: "Pemberi Ucapan Pertama", icon: "🎯", description: "Memberikan ucapan pertama", earned: submitCount >= 1 },
    { id: 2, name: "Kontributor Aktif", icon: "🏆", description: "Telah memberikan 5 feedback", earned: submitCount >= 5 },
    { id: 3, name: "Ahli Saran", icon: "💡", description: "Telah memberikan 10 saran", earned: submitCount >= 10 },
    { id: 4, name: "Penyemangat", icon: "❤️", description: "Telah memberikan 15 ucapan", earned: submitCount >= 15 },
    { id: 5, name: "Super Contributor", icon: "⭐", description: "Telah memberikan 20 feedback", earned: submitCount >= 20 },
  ];

  // Variants untuk animasi kartu
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Effect untuk menangani resize window (untuk confetti)
  useEffect(() => {
    const handleResize = () => { // Fungsi untuk update ukuran window
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize); // Tambahkan event listener
    return () => window.removeEventListener('resize', handleResize); // Hapus event listener saat unmount
  }, []);

  // Fungsi untuk mengambil data feedback dari API
  const fetchFeedback = async () => {
    try {
      setLoading(true); // Set loading menjadi true
      const res = await fetch(BASE_URL); // Fetch data dari API
      if (!res.ok) { // Jika response tidak ok
        toast.error("Gagal ambil data dari server."); // Tampilkan error toast
        setLoading(false); // Set loading false
        return;
      }
      const data = await res.json(); // Parse response JSON

      // Normalisasi data feedback
      const normalized = (data || []).map((f) => ({
        id: f.id,
        jenis: f.type,
        judul: f.title ?? null,
        isi: f.content ?? "",
        anonim: !!f.anonim,
        theme: f.themeColor ?? "maroon",
        userId: f.userId ?? f.user?.id ?? null,
        nama: f.user?.namaLengkap ?? null,
        createdAt: f.createdAt ?? null,
        likes: typeof f.likes === "number" ? f.likes : 0,
        raw: f,
      }));

      setAllFeedback(normalized); // Set state semua feedback
      setUcapanList(normalized.filter((x) => x.jenis === "UCAPAN").reverse()); // Set state ucapan (terbaru di atas)
      setSaranList(normalized.filter((x) => x.jenis === "SARAN").reverse()); // Set state saran (terbaru di atas)
      
      // Hitung statistik
      const totalUcapan = normalized.filter(x => x.jenis === "UCAPAN").length; // Hitung total ucapan
      const totalSaran = normalized.filter(x => x.jenis === "SARAN").length; // Hitung total saran
      
      setStats({ // Set state statistik
        totalFeedback: normalized.length,
        totalUcapan,
        totalSaran,
        topContributors: [...new Set(normalized.filter(f => !f.anonim).map(f => f.nama))] // Ambil top contributors (non-anonim)
          .slice(0, 5)
      });
    } catch (err) { // Tangani error
      console.error("Error fetching feedback:", err); // Log error
      toast.error("Terjadi kesalahan saat mengambil data."); // Tampilkan error toast
    } finally {
      setLoading(false); // Set loading false
    }
  };

  // Effect untuk fetch feedback dan set achievements saat component mount atau submitCount berubah
  useEffect(() => {
    fetchFeedback(); // Panggil fetchFeedback
    setAchievements(ACHIEVEMENTS_LIST); // Set achievements dari list
  }, [submitCount]);

  // Fungsi untuk handle submit feedback
  const handleSubmit = async () => {
    if ((feedbackType === "SARAN" && !judul?.trim()) || !isi?.trim()) { // Validasi input
      toast.warn("Lengkapi field yang diperlukan."); // Tampilkan warning toast
      return;
    }

    // Siapkan payload untuk API
    const payload = {
      type: feedbackType,
      title: feedbackType === "SARAN" ? judul.trim() : null,
      content: isi.trim(),
      anonim: !!anonim,
      themeColor: feedbackType === "UCAPAN" ? theme : null,
      userId: userId ?? null,
    };

    try {
      setSubmitting(true); // Set submitting true
      const res = await fetch(BASE_URL, { // Kirim POST request ke API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) { // Jika response tidak ok
        const txt = await res.text(); // Ambil response text
        console.error("Submit failed:", res.status, txt); // Log error
        toast.error("Gagal mengirim feedback."); // Tampilkan error toast
        setSubmitting(false); // Set submitting false
        return;
      }

      toast.success("Terima kasih! Feedback terkirim 🎉"); // Tampilkan success toast
      setShowConfetti(true); // Tampilkan confetti
      setTimeout(() => setShowConfetti(false), 3000); // Sembunyikan confetti setelah 3 detik

      const newCount = submitCount + 1; // Tingkatkan submit count
      setSubmitCount(newCount); // Set state submit count
      localStorage.setItem("gt_submit_count", String(newCount)); // Simpan ke localStorage

      // Reset form
      setJudul("");
      setIsi("");
      setAnonim(false);
      setTheme("maroon");
      setFeedbackType("SARAN");

      fetchFeedback(); // Refresh data feedback
    } catch (err) { // Tangani error
      console.error("Submit error:", err); // Log error
      toast.error("Terjadi kesalahan saat mengirim feedback."); // Tampilkan error toast
    } finally {
      setSubmitting(false); // Set submitting false
    }
  };

  // Fungsi untuk handle like feedback
  const handleLike = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}/like`, { // Kirim POST request untuk like
        method: "POST",
      });
      
      if (res.ok) { // Jika response ok
        fetchFeedback(); // Refresh data feedback
        toast.success("Feedback disukai!"); // Tampilkan success toast
      }
    } catch (err) { // Tangani error
      console.error("Error liking feedback:", err); // Log error
    }
  };

  // Fungsi untuk generate avatar dari nama
  const avatarFor = (name) => {
    if (!name) return "❓"; // Kembalikan "?" jika nama tidak ada
    return name.charAt(0).toUpperCase(); // Kembalikan huruf pertama kapital
  };

  // Data untuk pie chart (menggunakan useMemo untuk optimisasi)
  const pieData = useMemo(() => {
    return [
      { name: "Ucapan", value: ucapanList.length },
      { name: "Saran", value: saranList.length },
    ];
  }, [ucapanList, saranList]);

  // Data untuk bar chart (menggunakan useMemo untuk optimisasi)
  const barData = useMemo(() => {
    return [
      { name: "Total", total: allFeedback.length },
      { name: "Ucapan", total: ucapanList.length },
      { name: "Saran", total: saranList.length },
    ];
  }, [allFeedback, ucapanList, saranList]);

  // Data untuk trend chart (simulasi data mingguan)
  const feedbackTrendData = useMemo(() => {
    // Simulasi data tren (dalam implementasi nyata, ini akan dihitung dari createdAt)
    return [
      { name: "Senin", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Selasa", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Rabu", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Kamis", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Jumat", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Sabtu", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
      { name: "Minggu", ucapan: Math.floor(Math.random() * 10), saran: Math.floor(Math.random() * 10) },
    ];
  }, [allFeedback]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f0f0] to-[#f5e1e1] p-6 space-y-8"> {/* Container utama dengan gradient background */}
      <ToastContainer position="top-right" autoClose={3000} /> {/* Container untuk toast notifikasi */}
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} />} {/* Tampilkan confetti jika showConfetti true */}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20"> {/* Container header */}
        <div className="flex items-center justify-between"> {/* Flex container untuk judul dan XP */}
          <div>
            <h1 className="text-3xl font-bold text-[#800020] flex items-center gap-2"> {/* Judul halaman */}
              <Trophy className="text-amber-500" /> Achievement & Feedback Center
            </h1>
            <p className="text-gray-600 mt-2"> {/* Teks sapaan */}
              Halo <span className="font-semibold text-[#800020]">{username}</span>, 
              semua feedback dan saran yang terkirim dari semua siswa <span className="font-bold text-[#800020]">{submitCount}</span> feedback! 🎉
            </p>
          </div>
          <div className="bg-[#800020] text-white px-4 py-2 rounded-full flex items-center gap-2"> {/* Badge XP */}
            <Star size={18} />
            <span className="font-bold">{submitCount} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 flex border border-[#800020] border-opacity-20"> {/* Container tab navigasi */}
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${activeTab === "feedback" ? "bg-[#800020] text-white" : "text-gray-600"}`} // Tombol Feedback
          onClick={() => setActiveTab("feedback")} // Set activeTab ke "feedback" saat diklik
        >
          <MessageSquare size={18} /> Feedback
        </button>
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${activeTab === "achievements" ? "bg-[#800020] text-white" : "text-gray-600"}`} // Tombol Achievements
          onClick={() => setActiveTab("achievements")} // Set activeTab ke "achievements" saat diklik
        >
          <Award size={18} /> Achievements
        </button>
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${activeTab === "stats" ? "bg-[#800020] text-white" : "text-gray-600"}`} // Tombol Statistics
          onClick={() => setActiveTab("stats")} // Set activeTab ke "stats" saat diklik
        >
          <BarChart3 size={18} /> Statistics
        </button>
      </div>

      {activeTab === "feedback" && ( // Tampilkan jika tab aktif adalah "feedback"
        <>
          {/* Form Feedback */}
          <motion.div 
            initial="hidden" // State awal animasi
            animate="visible" // State animasi saat visible
            variants={cardVariants} // Variants animasi
            className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-[#800020] border-opacity-20" // Container form
          >
            <h2 className="text-xl font-bold text-[#800020] flex items-center gap-2"> {/* Judul form */}
              <Zap size={20} /> Berikan Feedback Baru
            </h2>
            
            <div className="flex gap-4"> {/* Container tombol jenis feedback */}
              <button
                onClick={() => setFeedbackType("SARAN")} // Set feedbackType ke "SARAN"
                className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  feedbackType === "SARAN" // Kondisi kelas aktif
                    ? "bg-[#800020] text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageSquare size={16} /> + Saran
              </button>
              <button
                onClick={() => setFeedbackType("UCAPAN")} // Set feedbackType ke "UCAPAN"
                className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  feedbackType === "UCAPAN" // Kondisi kelas aktif
                    ? "bg-[#DC143C] text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart size={16} /> + Ucapan
              </button>
            </div>

            {feedbackType === "SARAN" && ( // Tampilkan input judul jika feedbackType adalah "SARAN"
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label untuk input judul</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)} // Update state judul
                  placeholder="Masukkan judul saran Anda"
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent" // Styling input
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Label untuk textarea */}
                {feedbackType === "SARAN" ? "Isi Saran" : "Isi Ucapan"}
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)} // Update state isi
                placeholder={
                  feedbackType === "SARAN" // Placeholder berdasarkan jenis feedback
                    ? "Tulis saran Anda di sini..."
                    : "Tulis ucapan dan apresiasi Anda di sini..."
                }
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#800020] focus:border-transparent" // Styling textarea
                rows={4}
              />
            </div>

            {feedbackType === "UCAPAN" && ( // Tampilkan pilihan tema jika feedbackType adalah "UCAPAN"
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label untuk pilihan tema</label>
                <div className="flex gap-2 flex-wrap"> {/* Container tombol tema */}
                  {Object.keys(THEME_CLASSES).map((c) => ( // Map setiap tema
                    <button
                      key={c}
                      onClick={() => setTheme(c)} // Set tema saat diklik
                      className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                        theme === c  // Kondisi kelas aktif
                          ? "bg-[#800020] text-white shadow" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {c} {/* Nama tema */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"> {/* Label untuk checkbox anonim */}
              <input
                type="checkbox"
                checked={anonim}
                onChange={() => setAnonim(!anonim)} // Toggle state anonim
                className="rounded text-[#800020] focus:ring-[#800020]" // Styling checkbox
              />
              <span className="text-gray-700">Kirim sebagai anonim</span>
            </label>

            <button
              onClick={handleSubmit} // Panggil handleSubmit saat diklik
              disabled={submitting} // Nonaktifkan tombol saat submitting
              className="w-full py-3 bg-gradient-to-r from-[#800020] to-[#DC143C] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-70" // Styling tombol
            >
              {submitting ? ( // Tampilkan loading indicator jika submitting
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> {/* Spinner */}
                  Mengirim...
                </>
              ) : (
                <>
                  <Zap size={18} /> Kirim Feedback
                </>
              )}
            </button>
          </motion.div>

          {/* Feedback Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid container untuk list feedback */}
            {/* Ucapan List */}
            <motion.div 
              initial="hidden" // State awal animasi
              animate="visible" // State animasi saat visible
              variants={cardVariants} // Variants animasi
              className="bg-gradient-to-br from-[#800020] to-[#a53860] rounded-2xl shadow-lg p-6 border border-white border-opacity-20" // Container list ucapan
            >
              <div className="flex items-center justify-between mb-4"> {/* Header list ucapan */}
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart size={18} /> Ucapan Terbaru
                </h3>
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium"> {/* Badge jumlah ucapan */}
                  {ucapanList.length} ucapan
                </span>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Container item ucapan dengan scroll */}
                {ucapanList.length === 0 ? ( // Tampilkan jika tidak ada ucapan
                  <div className="text-center py-8 text-white">
                    <Heart size={40} className="mx-auto mb-2 opacity-80" />
                    <p className="font-semibold">Belum ada ucapan</p>
                  </div>
                ) : (
                  ucapanList.map((f) => ( // Map setiap ucapan
                    <motion.div 
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }} // Animasi awal
                      animate={{ opacity: 1, y: 0 }} // Animasi saat visible
                      transition={{ duration: 0.3 }} // Durasi animasi
                      className="p-4 bg-white bg-opacity-90 rounded-xl border-l-4 border-[#800020]" // Styling item ucapan
                    >
                      <p className="text-gray-800">{f.isi}</p> {/* Isi ucapan */}
                      <div className="flex items-center justify-between mt-3"> {/* Footer item (avatar dan like) */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#800020] bg-opacity-20 flex items-center justify-center text-[#800020] font-bold"> {/* Avatar */}
                            {f.anonim ? "?" : avatarFor(f.nama)} {/* Tampilkan "?" jika anonim */}
                          </div>
                          <span className="text-sm text-gray-600">
                            {f.anonim ? "Anonim" : f.nama || "Siswa"} {/* Nama atau "Anonim" */}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleLike(f.id)} // Panggil handleLike saat diklik
                          className="flex items-center gap-1 text-gray-500 hover:text-[#800020] transition-colors" // Styling tombol like
                        >
                          <ThumbsUp size={14} />
                          <span className="text-xs">{f.likes || 0}</span> {/* Jumlah like */}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            {/* Saran List */}
            <motion.div 
              initial="hidden" // State awal animasi
              animate="visible" // State animasi saat visible
              variants={cardVariants} // Variants animasi
              transition={{ delay: 0.1 }} // Delay animasi
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20" // Container list saran
            >
              <div className="flex items-center justify-between mb-4"> {/* Header list saran */}
                <h3 className="text-lg font-bold text-[#800020] flex items-center gap-2">
                  <MessageSquare size={18} /> Saran Terbaru
                </h3>
                <span className="bg-[#800020] bg-opacity-10 text-[#800020] px-3 py-1 rounded-full text-sm font-medium"> {/* Badge jumlah saran */}
                  {saranList.length} saran
                </span>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Container item saran dengan scroll */}
                {saranList.length === 0 ? ( // Tampilkan jika tidak ada saran
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
                    <p>Belum ada saran</p>
                  </div>
                ) : (
                  saranList.map((f) => ( // Map setiap saran
                    <motion.div 
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }} // Animasi awal
                      animate={{ opacity: 1, y: 0 }} // Animasi saat visible
                      transition={{ duration: 0.3, delay: 0.1 }} // Durasi dan delay animasi
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200" // Styling item saran
                    >
                      <h4 className="font-semibold text-[#800020]">{f.judul}</h4> {/* Judul saran */}
                      <p className="text-gray-700 mt-2">{f.isi}</p> {/* Isi saran */}
                      <div className="flex items-center justify-between mt-3"> {/* Footer item (avatar dan like) */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#800020] bg-opacity-20 flex items-center justify-center text-[#800020] font-bold"> {/* Avatar */}
                            {f.anonim ? "?" : avatarFor(f.nama)} {/* Tampilkan "?" jika anonim */}
                          </div>
                          <span className="text-sm text-gray-600">
                            {f.anonim ? "Anonim" : f.nama || "Siswa"} {/* Nama atau "Anonim" */}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleLike(f.id)} // Panggil handleLike saat diklik
                          className="flex items-center gap-1 text-gray-500 hover:text-[#800020] transition-colors" // Styling tombol like
                        >
                          <ThumbsUp size={14} />
                          <span className="text-xs">{f.likes || 0}</span> {/* Jumlah like */}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {activeTab === "achievements" && ( // Tampilkan jika tab aktif adalah "achievements"
        <motion.div 
          initial="hidden" // State awal animasi
          animate="visible" // State animasi saat visible
          variants={cardVariants} // Variants animasi
          className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20" // Container achievements
        >
          <h2 className="text-xl font-bold text-[#800020] mb-6 flex items-center gap-2"> {/* Judul achievements */}
            <Award className="text-amber-500" /> Pencapaian Anda
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid container untuk achievement items */}
            {achievements.map((achievement) => ( // Map setiap achievement
              <div 
                key={achievement.id} 
                className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  achievement.earned  // Kondisi kelas jika earned
                    ? "bg-amber-50 border-amber-300 shadow" 
                    : "bg-gray-100 border-gray-200 opacity-70"
                }`}
              >
                <div className={`text-3xl mb-2 ${achievement.earned ? "text-amber-500" : "text-gray-400"}`}> {/* Icon achievement */}
                  {achievement.icon}
                </div>
                <h3 className={`font-bold mb-1 ${achievement.earned ? "text-[#800020]" : "text-gray-500"}`}> {/* Nama achievement */}
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p> {/* Deskripsi achievement */}
                <div className={`text-xs px-2 py-1 rounded-full ${achievement.earned ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-500"}`}> {/* Status achievement */}
                  {achievement.earned ? "Tercapai" : "Dalam progres"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-[#800020] to-[#DC143C] rounded-xl text-white"> {/* Container progress level */}
            <h3 className="font-bold mb-2 flex items-center gap-2"> {/* Judul progress */}
              <TrendingUp size={18} /> Tingkatkan Level Anda!
            </h3>
            <p className="text-sm"> {/* Teks motivasi */}
              Terus berikan feedback yang konstruktif untuk membuka achievement lainnya dan meningkatkan level kontribusi Anda.
            </p>
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2"> {/* Container progress bar */}
              <div 
                className="bg-amber-300 h-2 rounded-full"  // Progress bar
                style={{ width: `${Math.min(100, (submitCount / 20) * 100)}%` }} // Lebar progress berdasarkan submitCount
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1"> {/* Label level */}
              <span>Level 1</span>
              <span>{submitCount}/20</span> {/* Progress text */}
              <span>Level 2</span>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "stats" && ( // Tampilkan jika tab aktif adalah "stats"
        <div className="space-y-6"> {/* Container statistics */}
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid container untuk stat cards */}
            <motion.div 
              initial="hidden" // State awal animasi
              animate="visible" // State animasi saat visible
              variants={cardVariants} // Variants animasi
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20 flex items-center" // Stat card: Total Feedback
            >
              <div className="rounded-full bg-[#800020] bg-opacity-10 p-3 mr-4"> {/* Icon */}
                <MessageSquare className="text-[#800020]" size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Feedback</h3> {/* Label */}
                <p className="text-2xl font-bold text-[#800020]">{stats.totalFeedback}</p> {/* Value */}
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" // State awal animasi
              animate="visible" // State animasi saat visible
              variants={cardVariants} // Variants animasi
              transition={{ delay: 0.1 }} // Delay animasi
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20 flex items-center" // Stat card: Total Ucapan
            >
              <div className="rounded-full bg-[#DC143C] bg-opacity-10 p-3 mr-4"> {/* Icon */}
                <Heart className="text-[#DC143C]" size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Ucapan</h3> {/* Label */}
                <p className="text-2xl font-bold text-[#800020]">{stats.totalUcapan}</p> {/* Value */}
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" // State awal animasi
              animate="visible" // State animasi saat visible
              variants={cardVariants} // Variants animasi
              transition={{ delay: 0.2 }} // Delay animasi
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20 flex items-center" // Stat card: Total Saran
            >
              <div className="rounded-full bg-[#B22222] bg-opacity-10 p-3 mr-4"> {/* Icon */}
                <BookOpen className="text-[#B22222]" size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Total Saran</h3> {/* Label */}
                <p className="text-2xl font-bold text-[#800020]">{stats.totalSaran}</p> {/* Value */}
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20"
            >
              <h3 className="text-lg font-bold text-[#800020] mb-4 flex items-center gap-2">
                <PieChart size={18} /> Distribusi Feedback
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name" 
                      outerRadius={80} 
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20"
            >
              <h3 className="text-lg font-bold text-[#800020] mb-4 flex items-center gap-2">
                <BarChart3 size={18} /> Perbandingan Feedback
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#800020" name="Jumlah Feedback" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Trend Chart */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20"
          >
            <h3 className="text-lg font-bold text-[#800020] mb-4 flex items-center gap-2">
              <TrendingUp size={18} /> Tren Feedback Mingguan
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedbackTrendData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ucapan" fill="#DC143C" name="Ucapan" />
                  <Bar dataKey="saran" fill="#800020" name="Saran" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Contributors */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-[#800020] border-opacity-20"
          >
            <h3 className="text-lg font-bold text-[#800020] mb-4 flex items-center gap-2">
              <Users size={18} /> Top Contributors
            </h3>
            <div className="space-y-3">
              {stats.topContributors.length > 0 ? (
                stats.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#800020] bg-opacity-20 flex items-center justify-center text-[#800020] font-bold">
                        {avatarFor(contributor)}
                      </div>
                      <span className="font-medium">{contributor}</span>
                    </div>
                    <span className="bg-[#800020] bg-opacity-10 text-[#800020] px-2 py-1 rounded-full text-xs">
                      #{index + 1}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Belum ada data contributor</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}