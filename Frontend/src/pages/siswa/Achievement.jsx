// Achievement.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {PieChart,Pie,Cell,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip,} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BASE_URL = "http://localhost:8080/api/feedback";

const THEME_CLASSES = {
  yellow: "bg-yellow-50 border-yellow-200",
  pink: "bg-pink-50 border-pink-200",
  green: "bg-green-50 border-green-200",
  blue: "bg-blue-50 border-blue-200",
  red: "bg-red-50 border-red-200",
  purple: "bg-purple-50 border-purple-200",
};

const PIE_COLORS = ["#d90429", "#ef233c", "#f77f00", "#fcbf49", "#ffdd57"];

export default function Achievement() {
  // form state
  const [feedbackType, setFeedbackType] = useState("SARAN");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [anonim, setAnonim] = useState(false);
  const [theme, setTheme] = useState("yellow");
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // data
  const [allFeedback, setAllFeedback] = useState([]);
  const [ucapanList, setUcapanList] = useState([]);
  const [saranList, setSaranList] = useState([]);

  // UI
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningMarquee, setRunningMarquee] = useState(true);

  // user
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const userId = user?.id ?? null;
  const username = user?.namaLengkap ?? user?.username ?? "Anda";

  // gamification
  const [submitCount, setSubmitCount] = useState(() => {
    const raw = localStorage.getItem("gt_submit_count");
    return raw ? Number(raw) : 0;
  });

  // emoji set for random decoration on cards
  const EMOJIS = ["🎉", "👏", "❤️", "🌟", "✨", "🔥", "🏆", "🤩"];

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch error:", res.status, text);
        toast.error("Gagal ambil data dari server.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      const normalized = (data || []).map((f) => ({
        id: f.id,
        jenis: f.jenis,
        judul: f.judul ?? null,
        isi: f.isi ?? f.content ?? "",
        anonim: !!f.anonim,
        theme: f.theme ?? "yellow",
        userId: f.userId ?? f.user?.id ?? null,
        nama: f.nama ?? f.user?.namaLengkap ?? null,
        status: f.status ?? "Diterima",
        createdAt: f.createdAt ?? f.createdAtString ?? null,
        likes: typeof f.likes === "number" ? f.likes : 0,
        raw: f,
      }));
      setAllFeedback(normalized);
      setUcapanList(normalized.filter((x) => x.jenis === "UCAPAN").reverse());
      setSaranList(normalized.filter((x) => x.jenis === "SARAN").reverse());
    } catch (err) {
      console.error("Error fetching feedback:", err);
      toast.error("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const totals = allFeedback.length;
    const ucapan = allFeedback.filter((f) => f.jenis === "UCAPAN").length;
    const saran = allFeedback.filter((f) => f.jenis === "SARAN").length;
    const authorCount = {};
    const guruCount = {};
    allFeedback.forEach((f) => {
      const author = f.nama ?? (f.anonim ? "Anonim" : "User");
      authorCount[author] = (authorCount[author] || 0) + 1;
      const guruName = f.raw?.guruMapel?.namaGuru;
      if (guruName) guruCount[guruName] = (guruCount[guruName] || 0) + 1;
    });
    const authorLeaderboard = Object.entries(authorCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const guruLeaderboard = Object.entries(guruCount)
      .map(([nama, count]) => ({ nama, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const pie = [
      { name: "Ucapan", value: ucapan },
      { name: "Saran", value: saran },
    ];
    return { totals, ucapan, saran, pie, authorLeaderboard, guruLeaderboard };
  }, [allFeedback]);

  const handleLike = async (id) => {
    setAllFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, likes: (f.likes || 0) + 1 } : f))
    );
    try {
      const res = await fetch(`${BASE_URL}/${id}/like`, { method: "POST" });
      if (!res.ok) {
        const txt = await res.text();
        console.warn("Like endpoint failed:", res.status, txt);
        toast.info("Like disimpan lokal (endpoint like belum tersedia).");
        return;
      }
      fetchFeedback();
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Gagal memberi like ke server.");
    }
  };

  const handleSubmit = async () => {
    if ((feedbackType === "SARAN" && !judul?.trim()) || !isi?.trim()) {
      toast.warn("Lengkapi field yang diperlukan.");
      return;
    }
    const payload = {
      jenis: feedbackType,
      judul: feedbackType === "SARAN" ? judul.trim() : null,
      isi: isi.trim(),
      anonim: !!anonim,
      theme: feedbackType === "UCAPAN" ? theme : null,
      userId: userId ?? null,
    };
    try {
      setSubmitting(true);
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Submit failed:", res.status, txt);
        toast.error("Gagal mengirim feedback.");
        setSubmitting(false);
        return;
      }
      toast.success("Terima kasih! Feedback terkirim 🎉");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
      const newCount = submitCount + 1;
      setSubmitCount(newCount);
      localStorage.setItem("gt_submit_count", String(newCount));
      setJudul("");
      setIsi("");
      setAnonim(false);
      setTheme("yellow");
      setFeedbackType("SARAN");
      fetchFeedback();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Terjadi kesalahan saat mengirim feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const avatarFor = (seed) => {
    const s = encodeURIComponent(seed || "anon");
    return `https://api.dicebear.com/8.x/thumbs/svg?seed=${s}`;
  };

  // Typewriter text for header
  const Typewriter = ({ text, speed = 60 }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
      setIndex(0);
      const id = setInterval(() => {
        setIndex((i) => {
          if (i >= text.length) {
            clearInterval(id);
            return text.length;
          }
          return i + 1;
        });
      }, speed);
      return () => clearInterval(id);
    }, [text, speed]);
    return <span>{text.slice(0, index)}</span>;
  };

  // random emoji for card display
  const randomEmoji = (seed) => {
    if (!seed) return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
    return EMOJIS[Math.abs(h) % EMOJIS.length];
  };

  // timeline component for saran
  const Timeline = ({ items = [] }) => {
    return (
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
        <ul className="space-y-6">
          {items.map((it) => (
            <li key={it.id} className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
                  <circle cx="12" cy="12" r="9" stroke="#f87171" strokeWidth="1.5" />
                  <path d="M8 12l2 2 4-4" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="ml-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{it.judul || "Saran"}</div>
                    <div className="text-sm text-gray-600">{it.isi}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{it.anonim ? "Anonim" : it.nama || "User"}</div>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${it.status === "Diterima" ? "bg-green-100 text-green-700" : it.status === "Diproses" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"} animate-pulse`}>{it.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // marquee content (running ucapan texts)
  const marqueeText = ucapanList.map((u) => `${u.anonim ? "Anonim" : u.nama}: ${u.isi}`).join("  •  ");

  // small hook to create floating emoji components positions
  const FloatingEmojis = () => {
    const decorations = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: `${10 + (i * 11) % 80}%`,
      delay: `${(i * 0.5) % 2}s`,
      size: 18 + (i % 4) * 6,
    }));
    return (
      <>
        {decorations.map((d) => (
          <div key={d.id} style={{ left: d.left, animationDelay: d.delay }} className="absolute top-10 animate-float pointer-events-none" aria-hidden>
            <div style={{ fontSize: d.size }} className="opacity-80">{d.emoji}</div>
          </div>
        ))}
      </>
    );
  };

  // references for confetti sizing
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-x-hidden">
      {/* Inline CSS for animations (so we don't need tailwind.config changes) */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animated {
          background: linear-gradient(90deg, #fff1f0 0%, #fff7ed 25%, #fff1f0 50%, #fff7f0 75%, #fff1f0 100%);
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }
        @keyframes floaty { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .animate-float { animation: floaty 4s ease-in-out infinite; }
        @keyframes shake { 0% { transform: translateX(0) } 25% { transform: translateX(-4px) } 50% { transform: translateX(4px) } 75% { transform: translateX(-2px) } 100% { transform: translateX(0) } }
        .hover-shake:hover { animation: shake 0.5s; }
        .flip-card { perspective: 1000px; }
        .flip-card-inner { transition: transform 0.6s; transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-front, .flip-back { backface-visibility: hidden; transform-style: preserve-3d; }
        .flip-back { transform: rotateY(180deg); position: absolute; top:0; left:0; width:100%; height:100%; }
        .typewriter { border-right: 2px solid rgba(255,255,255,0.6); padding-right:6px; }
        .marquee { white-space: nowrap; display:block; overflow:hidden; }
        .marquee > span { display:inline-block; padding-left:100%; animation: marquee 18s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
      `}</style>

      {/* animated gradient background (subtle) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-pink-50 via-yellow-50 to-white opacity-90 bg-animated" />

      {/* floating emojis */}
      <FloatingEmojis />

      <ToastContainer position="top-right" />

      {showConfetti && containerRef.current && (
        <Confetti numberOfPieces={220} recycle={false} width={containerRef.current.clientWidth} height={containerRef.current.clientHeight} />
      )}

      {/* HERO with typewriter */}
<header className="max-w-8xl mx-auto p-5 pb-15 relative z-10 mt-20">
  <div className="rounded-xl p-6 bg-gradient-to-r from-red-700 to-yellow-500 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4">
    <div className="flex-1">
      <h1 className="text-2xl font-extrabold flex items-center gap-3">
        <span className="text-3xl">🌟</span>
        <span className="typewriter">
          <Typewriter text={"Feedback & Wall of Appreciation — Kirim ucapan / saran untuk guru"} speed={35} />
        </span>
      </h1>
      <p className="mt-5 text-sm text-white/90 max-w-xl">
        Kirim ucapan atau saran — lihat leaderboard, charts, dan kartu ucapan animatif. Halaman penuh interaksi!
      </p>
    </div>

    <div className="text-right">
      <div className="text-sm opacity-90">Signed in as</div>
      <div className="mt-1 font-semibold">{username}</div>
      <div className="mt-2 text-xs">
        Submissions: {submitCount} {submitCount >= 5 && <span className="ml-2 px-2 py-1 rounded bg-white/20 text-xs">🏅 Contributor</span>}
      </div>
    </div>
  </div>

  {/* marquee running text underneath */}
  <div className="mt-6 rounded-md bg-white/30 backdrop-blur-sm p-2">
    <div className="marquee text-sm text-black">
      <span>{marqueeText || "Hallo semua, kenalin saya admin pacar Jungkook nih! ✨"}</span>
    </div>
  </div>
</header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 z-10 relative">
        {/* LEFT: Form + charts */}
        <section className="lg:col-span-2 space-y-6">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl shadow ${feedbackType === "SARAN" ? "bg-red-50" : "bg-yellow-50"}`}
          >
            <div className="flex gap-3 items-center mb-4">
              <button
                onClick={() => setFeedbackType("SARAN")}
                className={`px-3 py-2 rounded ${feedbackType === "SARAN" ? "bg-red-600 text-white" : "bg-white/80"}`}
              >
                SARAN
              </button>
              <button
                onClick={() => setFeedbackType("UCAPAN")}
                className={`px-3 py-2 rounded ${feedbackType === "UCAPAN" ? "bg-red-600 text-white" : "bg-white/80"}`}
              >
                UCAPAN
              </button>
              <div className="ml-auto text-sm text-gray-600">Pilih tipe untuk ubah style form</div>
            </div>

            <AnimatePresence mode="wait">
              {feedbackType === "SARAN" ? (
                <motion.div key="saran" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <input placeholder="Judul" className="w-full border rounded p-2 mb-3" value={judul} onChange={(e) => setJudul(e.target.value)} />
                  <textarea placeholder="Tulis saran..." className="w-full border rounded p-2 h-28 mb-2" value={isi} onChange={(e) => setIsi(e.target.value)} />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={anonim} onChange={() => setAnonim((s) => !s)} /> Kirim sebagai anonim</label>
                </motion.div>
              ) : (
                <motion.div key="ucapan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                  <textarea placeholder="Tulis ucapan..." className="w-full border rounded p-2 h-28 mb-2" value={isi} onChange={(e) => setIsi(e.target.value)} />
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-sm text-gray-600">Pilih tema:</div>
                    {Object.keys(THEME_CLASSES).concat("red","purple").slice(0,6).map((t) => (
                      <button key={t} onClick={() => setTheme(t)} className={`w-8 h-8 rounded-full border ${THEME_CLASSES[t] ?? "bg-red-50 border-red-200"} ${theme === t ? "ring-2 ring-red-500" : ""}`} />
                    ))}
                  </div>

                  {/* animated preview card */}
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }} className={`p-4 rounded ${THEME_CLASSES[theme] ?? "bg-yellow-50"} border`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">{randomEmoji(isi || username)}</div>
                      <div className="flex-1 italic text-gray-700">{isi || "Preview ucapan..."}</div>
                      <div className="text-xs text-gray-500">{anonim ? "Anonim" : username}</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-4">
              <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-red-700 text-white rounded shadow hover:bg-red-800 disabled:opacity-60">
                {submitting ? "Mengirim..." : "Kirim Feedback"}
              </button>
              <button onClick={() => { setJudul(""); setIsi(""); setAnonim(false); setTheme("yellow"); }} className="px-3 py-2 border rounded">Reset</button>
              <div className="ml-auto text-sm text-gray-500">Last update: {loading ? "loading..." : new Date().toLocaleTimeString()}</div>
            </div>
          </motion.div>

          {/* charts & summaries */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Total Feedback</div>
              <div className="text-2xl font-bold">{stats.totals}</div>
              <div className="text-xs text-gray-500 mt-1">Ucapan: {stats.ucapan} • Saran: {stats.saran}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Top Authors</div>
              <ol className="mt-2 space-y-1 text-sm">
                {stats.authorLeaderboard.map((a) => (
                  <li key={a.name} className="flex items-center gap-3">
                    <img src={avatarFor(a.name)} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">{a.name}</div>
                    <div className="font-semibold text-sm">{a.count}</div>
                  </li>
                ))}
                {stats.authorLeaderboard.length === 0 && <li className="text-gray-400">Belum ada data</li>}
              </ol>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm text-gray-500">Leaderboard Guru (mentions)</div>
              <ol className="mt-2 text-sm space-y-1">
                {stats.guruLeaderboard.map((g) => (
                  <li key={g.nama} className="flex justify-between">
                    <div className="truncate max-w-xs">{g.nama}</div>
                    <div className="font-semibold">{g.count}</div>
                  </li>
                ))}
                {stats.guruLeaderboard.length === 0 && <div className="text-gray-400">No mentions</div>}
              </ol>
            </div>
          </motion.div>

          {/* charts row */}
          <motion.div className="grid md:grid-cols-2 gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm font-semibold mb-2">Tipe Feedback</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={stats.pie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                      {stats.pie.map((entry, idx) => <Cell key={`c-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <div className="text-sm font-semibold mb-2">Recent Likes (top 6)</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={allFeedback.slice().sort((a,b)=> (b.likes||0)-(a.likes||0)).slice(0,6).map(x=>({ name: (x.nama||"Anonim").slice(0,12), likes: x.likes||0 }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="likes" fill="#f77f00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </section>

        {/* RIGHT: filters, preview, gamification + timeline */}
        <aside className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Wall Filters</div>
              <button onClick={() => fetchFeedback()} className="text-sm text-blue-600 hover:underline">Refresh</button>
            </div>
            <div className="mt-3 text-sm text-gray-600">Menampilkan {ucapanList.length} ucapan • {saranList.length} saran</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setUcapanList(allFeedback.filter(f=>f.jenis==="UCAPAN")); setSaranList(allFeedback.filter(f=>f.jenis==="SARAN")); }} className="px-2 py-1 rounded bg-gray-100 text-sm">All</button>
              <button onClick={() => setUcapanList(allFeedback.filter(f=>f.jenis==="UCAPAN"))} className="px-2 py-1 rounded bg-yellow-100 text-sm">Ucapan</button>
              <button onClick={() => setUcapanList([])} className="px-2 py-1 rounded bg-gray-100 text-sm">Clear</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl shadow">
            <div className="font-semibold mb-3">Wall Preview</div>
            <div className="space-y-3">
              {ucapanList.slice(0,3).map((u) => (
                <div key={u.id} className="flex gap-3 items-start">
                  <img src={avatarFor(u.nama || u.id)} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm italic text-gray-700 truncate">"{u.isi}"</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                      <span>{u.anonim ? "Anonim" : (u.nama || "User")}</span>
                      <button onClick={() => setSelectedCard(u)} className="text-xs text-blue-600">Lihat</button>
                    </div>
                  </div>
                </div>
              ))}
              {ucapanList.length === 0 && <div className="text-sm text-gray-400">Belum ada ucapan</div>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-sm text-gray-500">Kontribusi Kamu</div>
            <div className="text-2xl font-bold mt-2">{submitCount}</div>
            <div className="mt-3">
              {submitCount >= 10 ? <div className="inline-block px-3 py-1 rounded bg-yellow-300">🏆 Master Contributor</div> :
                submitCount >=5 ? <div className="inline-block px-3 py-1 rounded bg-yellow-200">🏅 Contributor</div> :
                <div className="inline-block px-3 py-1 rounded bg-gray-100">🤝 Mulai Berkontribusi</div>
              }
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl shadow">
            <div className="font-semibold mb-3">Timeline Saran</div>
            <Timeline items={saranList.slice(0,6)} />
          </motion.div>
        </aside>
      </main>

      {/* WALL (masonry) - cards with flip */}
      <section className="max-w-6xl mx-auto p-6 mt-6 z-10 relative">
        <h2 className="text-xl font-semibold mb-4">All Ucapan</h2>
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {ucapanList.length === 0 && <div className="bg-white p-6 rounded shadow text-center text-gray-500">Belum ada ucapan, jadilah yang pertama ✨</div>}
            {ucapanList.map((u) => (
              <motion.article
                key={u.id}
                className={`break-inside-avoid mb-4 relative flip-card ${THEME_CLASSES[u.theme] ?? THEME_CLASSES.yellow} border p-4 rounded-lg`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCard(u)}
              >
                <div className="flip-card-inner relative">
                  {/* front */}
                  <div className="flip-front flex items-start gap-3">
                    <img src={avatarFor(u.nama || u.id)} alt="" className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-800 truncate">{u.anonim ? "Anonim" : (u.nama || "User")}</div>
                        <div className="text-xs text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</div>
                      </div>
                      <p className="mt-2 text-gray-700 italic">"{u.isi.length > 200 ? u.isi.slice(0, 200) + "..." : u.isi}"</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleLike(u.id); }} className="px-2 py-1 bg-white/90 rounded text-sm hover-shake">❤️ {u.likes || 0}</button>
                        <div className="text-sm text-gray-500">{randomEmoji(u.isi || u.id)}</div>
                      </div>
                    </div>
                  </div>

                  {/* back */}
                  <div className="flip-back p-4 bg-white rounded-lg">
                    <div className="flex items-start gap-3">
                      <img src={avatarFor(u.nama || u.id)} alt="" className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="font-semibold">{u.judul || "Ucapan"}</div>
                        <div className="text-xs text-gray-500">{u.anonim ? "Anonim" : (u.nama || "User")}</div>
                        <p className="mt-3 text-gray-700">{u.isi}</p>
                        <div className="mt-3 text-xs text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Modal detail */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div onClick={() => setSelectedCard(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ y: 30, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.98 }} className="relative z-10 w-full max-w-2xl bg-white rounded-xl p-6 shadow-2xl">
              <div className="flex gap-4 items-start">
                <img src={avatarFor(selectedCard.nama || selectedCard.id)} className="w-16 h-16 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{selectedCard.judul ?? (selectedCard.jenis === "UCAPAN" ? "Ucapan" : "Saran")}</h3>
                      <div className="text-sm text-gray-500">{selectedCard.anonim ? "Anonim" : (selectedCard.nama || "User")}</div>
                    </div>
                    <div className="text-sm text-gray-500">{selectedCard.createdAt ? new Date(selectedCard.createdAt).toLocaleString() : ""}</div>
                  </div>

                  <p className="mt-4 text-gray-700">{selectedCard.isi}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => { handleLike(selectedCard.id); setSelectedCard((s)=> ({...s, likes: (s.likes||0)+1})); }} className="px-3 py-2 rounded bg-red-600 text-white">❤️ Like ({selectedCard.likes || 0})</button>
                    <button onClick={() => { navigator.clipboard?.writeText(selectedCard.isi); toast.info("Teks disalin ke clipboard"); }} className="px-3 py-2 rounded border">Copy</button>
                    <button onClick={() => { toast.info("Fitur export belum aktif"); }} className="px-3 py-2 rounded border">Export</button>
                    <div className="ml-auto text-xs text-gray-500">{selectedCard.jenis}</div>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedCard(null)} className="absolute top-3 right-3 text-gray-500">✖</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
