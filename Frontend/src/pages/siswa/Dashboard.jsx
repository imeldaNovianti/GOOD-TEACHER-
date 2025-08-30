// src/pages/siswa/Dashboard.jsx
import { Link } from "react-router-dom"; 
import { motion, useMotionValue, useTransform } from "framer-motion"; 
import { useEffect, useRef } from "react"; 

/** ---------- Particle Background (Canvas) ---------- */
function ParticlesBackground() { // deklarasi komponen untuk efek partikel di background
  const canvasRef = useRef(null); // ref untuk mengakses elemen canvas
  const reqRef = useRef(null); // ref untuk menyimpan requestAnimationFrame

  useEffect(() => { // jalankan efek setelah komponen mount
    const canvas = canvasRef.current; // ambil DOM canvas
    if (!canvas) return; // jika canvas tidak ada, hentikan
    const ctx = canvas.getContext("2d"); // ambil context 2D untuk menggambar

    let w = (canvas.width = window.innerWidth); // set lebar canvas sama dengan lebar window
    let h = (canvas.height = Math.max(window.innerHeight * 0.9, 700)); // set tinggi canvas min 700px atau 90% window

    const particles = Array.from({ length: 70 }).map(() => ({ // buat array partikel
      x: Math.random() * w, // posisi x random
      y: Math.random() * h, // posisi y random
      vx: (Math.random() - 0.5) * 0.6, // kecepatan x random
      vy: (Math.random() - 0.5) * 0.6, // kecepatan y random
      r: Math.random() * 2 + 0.7, // radius partikel
    }));

    function draw() { // fungsi menggambar setiap frame
      ctx.clearRect(0, 0, w, h); // bersihkan canvas

      // glow background (emas lembut)
      const grd = ctx.createRadialGradient( // buat gradient radial
        w * 0.2,
        h * 0.2,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h)
      );
      grd.addColorStop(0, "rgba(255,215,0,0.05)"); // bagian tengah gradient
      grd.addColorStop(1, "rgba(0,0,0,0.05)"); // bagian tepi gradient
      ctx.fillStyle = grd; // set fill style
      ctx.fillRect(0, 0, w, h); // gambar rectangle penuh canvas

      // links (emas neon)
      for (let i = 0; i < particles.length; i++) { // loop setiap partikel
        for (let j = i + 1; j < particles.length; j++) { // loop partikel berikutnya
          const a = particles[i]; // partikel a
          const b = particles[j]; // partikel b
          const dx = a.x - b.x; // jarak x
          const dy = a.y - b.y; // jarak y
          const dist = Math.sqrt(dx * dx + dy * dy); // jarak Euclidean
          if (dist < 120) { // jika jarak kurang dari 120
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.12 - dist / 1000})`; // warna garis transparan
            ctx.lineWidth = 1; // lebar garis
            ctx.beginPath(); // mulai path
            ctx.moveTo(a.x, a.y); // titik awal
            ctx.lineTo(b.x, b.y); // titik akhir
            ctx.stroke(); // gambar garis
          }
        }
      }

      // points
      particles.forEach((p) => { // loop setiap partikel
        p.x += p.vx; // update posisi x
        p.y += p.vy; // update posisi y
        if (p.x < 0 || p.x > w) p.vx *= -1; // pantulkan horizontal
        if (p.y < 0 || p.y > h) p.vy *= -1; // pantulkan vertikal

        ctx.beginPath(); // mulai path
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); // gambar lingkaran
        ctx.fillStyle = "rgba(255,255,255,0.7)"; // warna partikel putih transparan
        ctx.fill(); // isi lingkaran
      });

      reqRef.current = requestAnimationFrame(draw); // request frame berikutnya
    }

    reqRef.current = requestAnimationFrame(draw); // mulai animasi

    const onResize = () => { // fungsi saat resize window
      w = canvas.width = window.innerWidth; // update lebar
      h = canvas.height = Math.max(window.innerHeight * 0.9, 700); // update tinggi
    };
    window.addEventListener("resize", onResize); // pasang event listener resize

    return () => { // cleanup saat komponen unmount
      cancelAnimationFrame(reqRef.current); // hentikan animasi
      window.removeEventListener("resize", onResize); // hapus listener resize
    };
  }, []); // dependency array kosong -> efek hanya dijalankan sekali

  return ( // render canvas
    <canvas
      ref={canvasRef} // set ref canvas
      className="absolute inset-0 w-full h-full -z-10 opacity-70" // posisi absolute, z-index belakang, transparan
      aria-hidden // canvas tidak untuk aksesibilitas
    />
  );
}

/** ---------- Tilt Card Helper ---------- */
function TiltCard({ children, className = "" }) { // komponen untuk efek tilt pada card
  const ref = useRef(null); // ref card
  const x = useMotionValue(0); // posisi x gerak mouse
  const y = useMotionValue(0); // posisi y gerak mouse
  const rx = useTransform(y, [-50, 50], [8, -8]); // rotasi X dari y
  const ry = useTransform(x, [-50, 50], [-8, 8]); // rotasi Y dari x

  function handleMouseMove(e) { // handler saat mouse bergerak
    const bounds = ref.current.getBoundingClientRect(); // ambil posisi card
    const px = e.clientX - (bounds.left + bounds.width / 2); // offset X relatif ke tengah
    const py = e.clientY - (bounds.top + bounds.height / 2); // offset Y relatif ke tengah
    x.set(px / 4); // update motion value X
    y.set(py / 4); // update motion value Y
  }

  function reset() { // reset posisi saat mouse leave
    x.set(0); // X ke 0
    y.set(0); // Y ke 0
  }

  return ( // render card dengan motion.div
    <motion.div
      ref={ref} // ref card
      onMouseMove={handleMouseMove} // pasang mouse move
      onMouseLeave={reset} // pasang mouse leave
      style={{ rotateX: rx, rotateY: ry }} // rotasi X & Y
      className={`[transform-style:preserve-3d] transition-transform ${className}`} // CSS transform preserve 3d + transition
    >
      {children} {/* konten card */}
    </motion.div>
  );
}

/** ---------- Data Dummy ---------- */
const news = [ // data dummy berita
  {
    title: "Juara Olimpiade Matematika", // judul berita
    desc: "Selamat kepada siswa kelas XI yang meraih juara 1 Olimpiade Matematika tingkat provinsi!", // deskripsi
    img: "https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1200&auto=format&fit=crop", // gambar
    link: "/siswa/berita", // link detail
  },
  {
    title: "Workshop Digital Learning",
    desc: "Guru & siswa ikut workshop pembelajaran digital dengan Google for Education.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    link: "/siswa/berita",
  },
  {
    title: "Pentas Seni Tahunan",
    desc: "Pentas seni diikuti seluruh siswa dengan penuh semangat dan kreativitas.",
    img: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=1200&auto=format&fit=crop",
    link: "/siswa/berita",
  },
];

const features = [ // fitur aplikasi
  {
    title: "Kuisioner", // nama fitur
    desc: "Isi kuisioner untuk bantu tingkatkan kualitas pembelajaran.", // deskripsi
    img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop", // gambar
    link: "/siswa/kuisioner", // link fitur
  },
  {
    title: "Prestasi",
    desc: "Lihat pencapaianmu dan badge yang berhasil didapatkan.",
    img: "https://images.unsplash.com/photo-1520975922361-27e27b8033f3?q=80&w=1200&auto=format&fit=crop",
    link: "/siswa/prestasi",
  },
  {
    title: "Laporan",
    desc: "Pantau rekap penilaian kinerja guru & hasil kuisioner.",
    img: "https://images.unsplash.com/photo-1551281044-8b39f77e3e3c?q=80&w=1200&auto=format&fit=crop",
    link: "/siswa/laporan",
  },
  {
    title: "Forum Diskusi",
    desc: "Diskusi dan bertanya bersama teman atau guru.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    link: "/siswa/forum",
  },
];

const leaderboard = [ // data leaderboard siswa
  { name: "Alicia", points: 980 }, // nama & poin
  { name: "Bima", points: 930 },
  { name: "Celine", points: 905 },
  { name: "Davin", points: 870 },
];

const achievements = [ // data badge / achievements
  { name: "Starter", color: "from-[#e9e9e9] to-[#fafafa]", shadow: "shadow-white/20" },
  { name: "Active Rater", color: "from-[#ffb6b6] to-[#ffe6ad]", shadow: "shadow-[#ffd700]/30" },
  { name: "Gold Contributor", color: "from-[#ffd24d] to-[#ffe584]", shadow: "shadow-[#ffd24d]/40" },
];

/** ---------- Main Component ---------- */
function Dashboard() { // komponen utama Dashboard siswa
  return ( // render utama
    <div className="relative overflow-hidden"> {/* container relative + overflow hidden */}
      {/* BACKGROUND: gradient + aurora + particles */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#141412] via-[#c92828] to-[#141412]" /> {/* gradient background */}
      <div className="absolute -z-10 inset-0 pointer-events-none"> {/* aurora / nebula */}
        <div className="absolute w-[36rem] h-[36rem] bg-[#c92828]/20 blur-[120px] rounded-full top-[-10%] left-[-10%] animate-pulse" /> {/* blob merah */}
        <div className="absolute w-[40rem] h-[40rem] bg-[#ffd700]/10 blur-[140px] rounded-full bottom-[-10%] right-[-10%] animate-ping" /> {/* blob emas */}
        <div className="absolute w-[28rem] h-[28rem] bg-[#ffd700]/10 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 animate-pulse" /> {/* blob tengah */}
      </div>
      <ParticlesBackground /> {/* partikel canvas */}

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center text-black px-19"> {/* section hero */}
        <TiltCard className="max-w-4xl w-full"> {/* card dengan tilt effect */}
          <motion.div
            initial={{ opacity: 0, y: -30 }} // animasi awal
            animate={{ opacity: 1, y: 0 }} // animasi saat mount
            transition={{ duration: 0.9 }} // durasi animasi
            className="text-center bg-white/5 backdrop-blur-xl border border-[#ffd700]/30 rounded-3xl p-10 shadow-[0_10px_60px_rgba(255,215,0,0.25)]" // style card
          >
            <motion.h1
              initial={{ letterSpacing: "0.05em" }} // animasi letter spacing awal
              animate={{ letterSpacing: "0.15em" }} // animasi letter spacing akhir
              transition={{ duration: 1.9, delay: 0.3 }} // durasi + delay
              className="text-4xl md:text-5xl font-extrabold tracking-wide text-[#8f0f0f]" // style judul
            >
              GoodTeacher {/* nama aplikasi */}
            </motion.h1>
            <p className="mt-3 text-sm md:text-base text-black-200"> {/* deskripsi singkat */}
              Sistem Penilaian Kinerja Guru oleh Siswa – cepat, transparan, elegan.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap"> {/* tombol hero */}
              <Link
                to="/siswa/kuisioner" // link kuisioner
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f19797] via-[#e63039] to-[#cf3851] text-black font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.35)] transition-transform hover:-translate-y-0.5" // style tombol
              >
                Mulai Isi Kuisioner
              </Link>
              <Link
                to="/siswa/about" // link about
                className="px-6 py-3 rounded-xl bg-white/10 text-[#701010] border border-white/20 hover:bg-white/20 transition-transform hover:-translate-y-0.5" // style tombol
              >
                tentang kami
              </Link>
            </div>
          </motion.div>
        </TiltCard>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10"> {/* section stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {/* grid stats */}
          {[ // data stat dummy
            { k: "Guru Berkualitas", v: "50+" },
            { k: "Siswa Aktif", v: "1200+" },
            { k: "Prestasi Nasional", v: "30+" },
            { k: "Ekstrakurikuler", v: "20+" },
          ].map((s, i) => ( // loop stat
            <motion.div
              whileHover={{ y: -4 }} // efek hover
              key={i} // key unik
              className="rounded-2xl p-6 text-center bg-white/5 border border-white/10 backdrop-blur-xl text-[#e00a0a]" // style box
            >
              <div className="text-2xl md:text-3xl font-extrabold text-[#e00a0a] drop-shadow"> {/* angka */}
                {s.v}
              </div>
              <div className="text-sm text-black-200">{s.k}</div> {/* label */}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FITUR (with tilt & shine) */}
      <section className="max-w-7xl mx-auto px-6 mt-20"> {/* section fitur */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#131212] text-center mb-10"> {/* judul fitur */}
          Fitur Aplikasi
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* grid fitur */}
          {features.map((f, idx) => ( // loop fitur
            <TiltCard key={idx} className="group"> {/* tilt effect */}
              <Link
                to={f.link} // link fitur
                className="relative block rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl text-black shadow-lg" // style fitur
              >
                <img
                  src={f.img} // gambar fitur
                  alt={f.title} // alt
                  className="h-40 w-full object-cover opacity-90 group-hover:opacity-100 transition" // style gambar
                />
                {/* shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <div className="p-5">
                  <div className="font-semibold text-lg text-[#111110]">{f.title}</div> {/* judul fitur */}
                  <p className="text-sm text-black-200 mt-1">{f.desc}</p> {/* deskripsi */}
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* TIMELINE (Journey) */}
      <section className="max-w-6xl mx-auto px-6 mt-20 text-black"> {/* section journey */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#9b101c]"> {/* judul */}
          Journey Penilaian
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#ffd700]/30 to-[#c92828]/30 rounded-lg" /> {/* garis timeline */}
          <div className="space-y-10">
            {[ // step journey
              { t: "Login", d: "Masuk ke akun siswa kamu." },
              { t: "Isi Kuisioner", d: "Nilai guru berdasarkan pengalaman belajar." },
              { t: "Rekap & Analitik", d: "Lihat ringkasan dan grafik hasil." },
              { t: "Achievement", d: "Dapatkan badge & poin kontribusi." },
            ].map((step, i) => ( // loop step
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 ? 60 : -60 }} // animasi awal
                whileInView={{ opacity: 1, x: 0 }} // animasi saat muncul
                viewport={{ once: true, amount: 0.4 }} // hanya muncul sekali
                transition={{ duration: 0.6, delay: i * 0.05 }} // delay antar step
                className={`relative grid md:grid-cols-2 gap-6 items-center ${
                  i % 2 ? "md:pl-16" : "md:pr-16"
                }`} // grid step
              >
                <div className={`${i % 2 ? "md:order-2" : ""}`}>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                    <div className="text-xl font-bold text-[#960c1e]">{step.t}</div> {/* title step */}
                    <p className="text-sm text-black-200 mt-1">{step.d}</p> {/* description step */}
                  </div>
                </div>
                <div className={`${i % 2 ? "md:order-1" : ""} flex md:justify-end`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b90826] to-[#c92828] shadow-[0_0_25px_rgba(255,215,0,0.5)] relative">
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#ffd700]/40" /> {/* efek ping */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMIFICATION: Achievements + Leaderboard */}
      <section className="max-w-7xl mx-auto px-6 mt-20 text-black">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#1a180d]">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={`rounded-2xl p-5 bg-gradient-to-br ${a.color} text-zinc-900 shadow-xl ${a.shadow}`}
                >
                  <div className="font-bold">🏅 {a.name}</div>
                  <div className="mt-2 h-2 rounded bg-black/10">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-[#0a0a09] to-[#c92828]"
                      style={{ width: `${70 + i * 10}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-[#0f0f0e]">Leaderboard Siswa</h3>
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[#131211]">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{r.name}</td>
                      <td className="px-4 py-3">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black-300 mt-2">
              *Poin naik saat kamu aktif mengisi kuisioner dan ikut program sekolah.
            </p>
          </div>
        </div>
      </section>

      {/* BERITA */}
      <section className="max-w-7xl mx-auto px-6 mt-20 text-[#0f0f0e]">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#131212]">
          Berita & Pengumuman
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <img src={n.img} alt={n.title} className="w-full h-44 object-cover" />
              <div className="p-5">
                <div className="font-semibold text-lg text-[#181817]">{n.title}</div>
                <p className="text-sm text-black-200 mt-1">{n.desc}</p>
                <Link
                  to={n.link}
                  className="inline-block mt-3 text-[#0a0a0a] hover:underline"
                >
                  Baca Selengkapnya →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Interaktif */}
      <section className="max-w-5xl mx-auto px-6 mt-20 text-black">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#1d1c1a]">
          Pertanyaan Umum
        </h2>
        <div className="space-y-3">
          {[ // pertanyaan & jawaban dummy
            {
              q: "Apakah penilaian anonim?",
              a: "Ya, sistem dapat diatur anonim sesuai kebijakan sekolah sehingga siswa merasa aman berpendapat.",
            },
            {
              q: "Apakah bisa export laporan?",
              a: "Bisa. Laporan tersedia dalam bentuk grafik dan bisa diexport ke PDF/Excel.",
            },
            {
              q: "Bagaimana cara mendapatkan badge?",
              a: "Kumpulkan poin dari aktivitas seperti mengisi kuisioner, tepat waktu, dan ikut program sekolah.",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="group rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-[#5f0909]">
                {f.q} {/* pertanyaan */}
              </summary>
              <p className="text-sm text-[#5f0909] mt-2">{f.a}</p> {/* jawaban */}
            </details>
          ))}
        </div>
      </section>


      {/* FOOTER WAVE */}
<footer className="mt-24 relative overflow-hidden">
  {/* Wave SVG */}
  <svg viewBox="0 0 1440 320" className="w-full">
    <path
      fill="rgba(255,215,0,0.15)"
      d="M0,96L48,85.3C96,75,192,53,288,85.3C384,117,480,203,576,213.3C672,224,768,160,864,144C960,128,1056,160,1152,197.3C1248,235,1344,277,1392,298.7L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    ></path>
  </svg>

  {/* Marquee / moving text */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="whitespace-nowrap animate-marquee text-center text-[#cf4343] text-lg md:text-xl font-bold px-6">
      Sistem Penilaian Kinerja Guru oleh Siswa. Cepat, transparan, elegan. Membuka ruang kolaborasi agar pembelajaran semakin berkualitas. &nbsp;•&nbsp;
    </div>
  </div>

  <style>{`
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .animate-marquee {
      display: inline-block;
      animation: marquee 20s linear infinite;
    }
  `}</style>
</footer>
    </div>
  );
}

export default Dashboard;
