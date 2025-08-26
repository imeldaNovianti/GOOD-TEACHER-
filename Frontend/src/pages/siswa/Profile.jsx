// Profile.jsx
import { useEffect, useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCalendar,
  FaSave,
  FaEdit,
  FaIdCard,
  FaChalkboardTeacher,
  FaHistory,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";

/**
 * Profile page upgraded:
 * - animated hero banner + aurora background
 * - floating avatar with preview/upload UI (local preview only)
 * - statistic cards (animated)
 * - mini bar chart (avg per guru from kuisioner data)
 * - timeline of activity (kuisioner submissions)
 * - editable details with glassmorphism panel & animated buttons
 * - quotes carousel
 *
 * Requirements: framer-motion, recharts, tailwindcss
 */

function Profile() {
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // extra UI state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [quotesIndex, setQuotesIndex] = useState(0);
  const [hasil, setHasil] = useState([]); // kuisioner data for stats & timeline
  const [statsLoading, setStatsLoading] = useState(true);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?.id;

  const quotes = [
    "📚 Belajar hari ini, memimpin besok.",
    "🌟 Suaramu membantu guru berkembang.",
    "🚀 Kontribusi kecil, dampak besar untuk sekolah.",
    "🤝 Terus aktif — jadi agen perubahan!",
  ];

  const quoteTimerRef = useRef(null);

  // rotate quotes
  useEffect(() => {
    quoteTimerRef.current = setInterval(() => {
      setQuotesIndex((q) => (q + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(quoteTimerRef.current);
  }, []);

  // fetch profile & kuisioner results
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setStatsLoading(false);
      return;
    }

    const fetchProfile = fetch(`http://localhost:8080/api/users/${userId}`).then((r) =>
      r.ok ? r.json() : Promise.reject("Failed user")
    );

    // hasil kuisioner siswa (dipakai untuk stats & timeline)
    const fetchHasil = fetch(
      `http://localhost:8080/api/kuisioner-jawaban/siswa/${userId}`
    ).then((r) => (r.ok ? r.json() : [])); // fallback to []

    Promise.all([fetchProfile, fetchHasil])
      .then(([u, h]) => {
        setUser(u);
        setEditUser(u);
        setHasil(h || []);
      })
      .catch((err) => {
        console.error("Error fetching profile/hasil:", err);
      })
      .finally(() => {
        setLoading(false);
        setStatsLoading(false);
      });
  }, [userId]);

  // handle input change
  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  // save profile (PUT)
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error("Gagal update profile");
      const updated = await res.json();
      setUser(updated);
      setEditUser(updated);
      setIsEditing(false);
      alert("✅ Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal menyimpan profil.");
    }
  };

  // avatar upload preview (local only)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // NOTE: not uploading to backend here — you can extend with FormData POST
  };

  // Derived statistics from hasil
  const totalKuisioner = hasil.length;
  const guruSet = new Set(hasil.map((h) => h.guruMapel?.id).filter(Boolean));
  const guruCount = guruSet.size;

  // avg skor per guru (only numeric answers)
  const perGuru = hasil.reduce((acc, it) => {
    const g = it.guruMapel?.namaGuru || "Unknown";
    const val = typeof it.jawaban === "number" ? it.jawaban : null;
    if (!acc[g]) acc[g] = { guru: g, total: 0, count: 0 };
    if (val !== null) {
      acc[g].total += val;
      acc[g].count += 1;
    }
    return acc;
  }, {});
  const barData = Object.values(perGuru).map((g) => ({
    guru: g.guru.length > 12 ? g.guru.slice(0, 12) + "…" : g.guru,
    avg: g.count ? +(g.total / g.count).toFixed(2) : 0,
  }));

  // timeline (group hasil by submission id or createdAt)
  // If your API returns separate answers per question, group by a 'submission' key if exists.
  // Here we fallback to grouping by createdAt date (day).
  const timeline = hasil
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8) // latest 8 items
    .map((h) => ({
      id: h.id,
      title: h.guruMapel?.namaGuru || "Guru",
      subtitle: h.pertanyaan?.teks?.slice(0, 60) + (h.pertanyaan?.teks?.length > 60 ? "..." : ""),
      detail: typeof h.jawaban === "number" ? `Skor ${h.jawaban}` : h.jawaban,
      date: h.createdAt ? new Date(h.createdAt).toLocaleString("id-ID") : "-",
    }));

  if (loading) return <p className="p-6 animate-pulse">⏳ Memuat profil...</p>;
  if (!userId) return <p className="p-6 text-red-600">⚠️ User belum login.</p>;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fff1f0] via-[#fff7ed] to-white p-6">
      {/* subtle moving gradient shapes (aurora) */}
      <motion.div
        className="pointer-events-none absolute -z-10 inset-0"
        animate={{ opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="absolute -left-40 top-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-red-200 to-yellow-200 opacity-30 blur-3xl" />
        <div className="absolute right-0 top-48 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-pink-200 to-red-200 opacity-25 blur-2xl" />
      </motion.div>

      {/* HERO */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm border border-white/30 p-6 flex flex-col md:flex-row items-center gap-6">
          {/* left: text */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-extrabold text-red-700"
              style={{ textShadow: "0 0 10px rgba(255,96,92,0.25), 0 0 20px rgba(255,200,60,0.12)" }}
            >
              Halo, {user.namaLengkap} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-gray-600 mt-2 max-w-2xl"
            >
              Ini adalah profilmu — lengkap dengan ringkasan aktivitas, statistik,
              dan timeline kontribusi. Kamu bisa update data secara cepat dan melihat
              pengaruh suaramu terhadap kualitas pengajaran.
            </motion.p>

            {/* small badges */}
            <div className="mt-4 flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm"
              >
                {user.kelas || "Kelas -"}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm"
              >
                Kontributor: {totalKuisioner}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="px-3 py-1 rounded-full bg-white text-gray-800 font-medium text-sm shadow-sm"
              >
                Tipe: {user.role || "SISWA"}
              </motion.div>
            </div>
          </div>

          {/* right: avatar + quick stats */}
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col items-center">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: [0, 6, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-40 h-40 rounded-full bg-white shadow-2xl p-3 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  // deterministic avatar as fallback using DiceBear
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user.namaLengkap || "user"
                    )}`}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>

              {/* small glow ring */}
              <div className="absolute -inset-1 rounded-full border-4 border-transparent" style={{
                boxShadow: "0 0 30px rgba(255,96,92,0.18), 0 0 60px rgba(255,200,60,0.08)"
              }} />
            </motion.div>

            <label className="mt-4 flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <span className="px-3 py-2 bg-white text-red-700 font-semibold rounded-md shadow hover:scale-105 transition">Ubah Foto</span>
              <span className="text-xs text-gray-500">Preview lokal (tidak otomatis upload)</span>
            </label>

            {/* quick stat cards */}
            <div className="mt-4 w-full grid grid-cols-3 gap-2">
              <StatTiny label="Kuisioner" value={totalKuisioner} accent="red" />
              <StatTiny label="Guru" value={guruCount} accent="yellow" />
              <StatTiny label="Avg" value={calcAvgPerAll(hasil)} accent="gold" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: editable details (glass) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-red-700">Detail Informasi</h3>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow"
                >
                  <FaEdit /> Edit
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditUser(user);
                    }}
                    className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    onClick={handleSave}
                    className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md"
                  >
                    <FaSave /> Simpan
                  </motion.button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormRow label="Email" icon={<FaEnvelope />} name="email" value={editUser.email} readOnly={!isEditing} onChange={handleChange} />
            <FormRow label="No HP" icon={<FaPhone />} name="noHp" value={editUser.noHp} readOnly={!isEditing} onChange={handleChange} />
            <FormRow label="Tanggal Lahir" icon={<FaCalendar />} name="tglLahir" type="date" value={editUser.tglLahir} readOnly={!isEditing} onChange={handleChange} />
            <div>
              <label className="block text-sm text-gray-600">Username</label>
              <input className="mt-1 w-full p-2 rounded-md border bg-gray-100" value={editUser.username || ""} readOnly />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600"><FaHome /> Alamat</label>
              <textarea name="alamat" onChange={handleChange} value={editUser.alamat || ""} readOnly={!isEditing} className={`mt-1 w-full p-2 rounded-md border ${!isEditing ? "bg-gray-100" : ""}`} />
            </div>
            <FormRow label="Nama Ayah" name="namaAyah" value={editUser.namaAyah} onChange={handleChange} readOnly={!isEditing} />
            <FormRow label="Nama Ibu" name="namaIbu" value={editUser.namaIbu} onChange={handleChange} readOnly={!isEditing} />
          </div>

          {/* mini chart & timeline row */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-inner border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Rata-rata skor per guru</h4>
              {statsLoading ? (
                <p className="text-sm text-gray-500">Memuat...</p>
              ) : barData.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Belum ada data numerik.</p>
              ) : (
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <XAxis dataKey="guru" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 5]} />
                      <ReTooltip />
                      <Bar dataKey="avg" fill="#f97316" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-inner border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaHistory /> Aktivitas Terbaru</h4>
              <div className="space-y-3 max-h-44 overflow-auto pr-2">
                <AnimatePresence>
                  {timeline.length === 0 && <p className="text-sm text-gray-500 italic">Belum ada aktivitas.</p>}
                  {timeline.map((t, i) => (
                    <motion.div
                      key={t.id || i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="p-2 rounded-md hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-800">{t.title}</div>
                          <div className="text-xs text-gray-500">{t.subtitle}</div>
                        </div>
                        <div className="text-xs text-gray-400">{t.date.split(",")[0]}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{t.detail}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: quotes & motivational card */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <motion.div className="bg-white p-4 rounded-2xl shadow-lg border" whileHover={{ scale: 1.02 }}>
            <h4 className="text-sm font-semibold text-red-700 mb-2">Quote of the Moment</h4>
            <AnimatePresence mode="wait">
              <motion.p
                key={quotesIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className="text-sm text-gray-700"
              >
                {quotes[quotesIndex]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setQuotesIndex((q) => (q - 1 + quotes.length) % quotes.length)} className="px-3 py-1 rounded bg-gray-100">Prev</button>
              <button onClick={() => setQuotesIndex((q) => (q + 1) % quotes.length)} className="px-3 py-1 rounded bg-red-600 text-white">Next</button>
            </div>
          </motion.div>

          <motion.div className="bg-gradient-to-r from-yellow-100 to-red-100 p-4 rounded-2xl shadow-lg border" whileHover={{ scale: 1.02 }}>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Achievement</h4>
            <p className="text-sm text-gray-700 mb-3">Badge: <span className="font-bold">{totalKuisioner >= 10 ? "💎 Kontributor Aktif" : "📘 Pengulas Baru"}</span></p>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-red-600" style={{ width: `${Math.min(100, (totalKuisioner / 10) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-600 mt-2">Isi 10 kuisioner untuk naik level.</p>
          </motion.div>
        </motion.aside>
      </div>

      {/* Footer motivational */}
      <motion.footer initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mt-10 text-center p-4">
        <div className="text-sm text-gray-600">
          Teruslah berkontribusi — suara kecilmu berdampak besar bagi kualitas pengajaran 🎓✨
        </div>
      </motion.footer>
    </div>
  );
}

/* ---------- small helper components ---------- */

function StatTiny({ label, value, accent = "red" }) {
  const colors = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-800",
    gold: "bg-amber-100 text-amber-800",
  };
  return (
    <div className={`p-2 rounded-md text-center ${colors[accent] || colors.red}`}>
      <div className="text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function FormRow({ label, icon, name, value, readOnly = false, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 flex items-center gap-2">
        {icon} {label}
      </label>
      {type === "textarea" ? (
        <textarea name={name} value={value || ""} onChange={onChange} readOnly={readOnly} className={`mt-1 w-full p-2 rounded-md border ${readOnly ? "bg-gray-100" : ""}`} />
      ) : (
        <input name={name} type={type} value={value || ""} onChange={onChange} readOnly={readOnly} className={`mt-1 w-full p-2 rounded-md border ${readOnly ? "bg-gray-100" : ""}`} />
      )}
    </div>
  );
}

function calcAvgPerAll(hasil) {
  const arr = hasil.map((h) => (typeof h.jawaban === "number" ? h.jawaban : null)).filter(Boolean);
  if (!arr.length) return 0;
  const avg = (arr.reduce((a,b)=>a+b,0) / arr.length).toFixed(2);
  return avg;
}

export default Profile;
