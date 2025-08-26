import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  AcademicCapIcon, GlobeAltIcon, UserGroupIcon, ChartBarIcon, 
  CheckCircleIcon, PhoneIcon, EnvelopeIcon 
} from "@heroicons/react/24/outline";

function TypeWriter({ text, speed = 100 }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">{displayed}</h2>;
}

function About() {
  const features = [
    { icon: AcademicCapIcon, title: "Manajemen Data", desc: "CRUD siswa, guru, fakultas, jurusan, mata pelajaran, dan pertanyaan." },
    { icon: UserGroupIcon, title: "Penilaian Guru", desc: "Siswa mengisi kuisioner kinerja guru dengan mudah & aman." },
    { icon: ChartBarIcon, title: "Laporan Statistik", desc: "Grafik skor guru, filter data, dan download laporan PDF." },
    { icon: CheckCircleIcon, title: "Gamifikasi", desc: "Progress bar kuisioner dan achievement untuk motivasi siswa." },
    { icon: GlobeAltIcon, title: "Akses Online", desc: "Aplikasi berbasis web, responsif & mobile-friendly." },
    { icon: AcademicCapIcon, title: "Audit Trail", desc: "Catat semua aktivitas penting agar lebih transparan." }
  ];

  const team = [
    { name: "Haikal Mardiansyah", role: "Fullstack Developer", img: "https://picsum.photos/200?random=11" },
    { name: "Rina Putri", role: "Frontend Engineer", img: "https://picsum.photos/200?random=12" },
    { name: "Budi Santoso", role: "Backend Engineer", img: "https://picsum.photos/200?random=13" }
  ];

  const testimonials = [
    { name: "Haikal - Siswa", text: "GoodTeacher bikin penilaian guru jadi mudah dan transparan. Aku suka fitur progress bar!" },
    { name: "Bapak Andi - Guru", text: "Feedback dari siswa sangat membantu saya memperbaiki metode mengajar." },
    { name: "Ibu Sari - BK", text: "Laporan dan filter datanya sangat membantu dalam evaluasi guru secara menyeluruh." }
  ];

  return (
    <div className="p-6 font-sans text-black space-y-16 bg-gradient-to-br from-cream-50 via-maroon-100 to-maroon-200">

      {/* Header with Typewriter */}
      <motion.header 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <TypeWriter text="Tentang Aplikasi GoodTeacher" speed={100} />
        <motion.p 
          className="text-lg md:text-xl max-w-3xl mx-auto font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          GoodTeacher adalah sistem informasi penilaian kinerja guru oleh siswa. 
          Memberikan <strong className="text-red-600">transparansi</strong>, <strong className="text-red-800">akuntabilitas</strong>, dan <strong className="text-red-500">partisipasi siswa</strong> untuk kualitas pendidikan yang lebih baik.
        </motion.p>
      </motion.header>

      {/* Profil Sekolah */}
      <motion.section 
        className="p-6 rounded-3xl shadow-xl bg-gradient-to-r from-cream-50 via-red-200 to-red-700"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl font-extrabold mb-4 text-center animate-bounce">Profil Sekolah</h3>
        <p className="text-center text-black font-semibold text-lg">
          <strong>SMA/Universitas Good Teacher</strong> berdiri sejak 1995 dengan visi mencetak generasi unggul berkarakter, kreatif, dan inovatif. Saat ini ada lebih dari <span className="font-bold text-yellow-400">2.500 siswa</span> & <span className="font-bold text-red-800">120 guru</span> aktif.
        </p>
        <motion.ul 
          className="mt-6 list-disc ml-6 text-black space-y-2 text-lg font-semibold"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, staggerChildren: 0.2 }}
        >
          <li>Alamat: Jl. Pendidikan No. 123, Jakarta</li>
          <li>Email: info@goodteacher.ac.id</li>
          <li>Telp: (021) 123-4567</li>
          <li>Website: <a href="https://www.kemdikbud.go.id" className="text-red-800 hover:underline">kemdikbud.go.id</a></li>
        </motion.ul>
      </motion.section>

      {/* Visi & Misi */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Visi & Misi</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="p-6 bg-gradient-to-br from-cream-50 via-red-200 to-red-700 shadow-2xl rounded-2xl hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-extrabold mb-2 text-lg">Visi</h4>
            <p className="text-black text-lg font-semibold">Menjadi sekolah unggulan yang memanfaatkan teknologi digital untuk meningkatkan kinerja guru & keterlibatan siswa.</p>
          </motion.div>
          <motion.div 
            className="p-6 bg-gradient-to-br from-red-100 via-cream-50 to-red-500 shadow-2xl rounded-2xl hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-extrabold mb-2 text-lg">Misi</h4>
            <ul className="list-disc ml-6 space-y-2 text-black text-lg font-semibold">
              <li>Meningkatkan transparansi penilaian guru</li>
              <li>Mendorong partisipasi siswa</li>
              <li>Menyediakan laporan akurat</li>
              <li>Mendukung inovasi digital</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* Fitur */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Fitur Utama</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center text-center p-6 rounded-2xl shadow-xl bg-gradient-to-tr from-cream-50 via-red-200 to-red-700 hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <f.icon className="w-12 h-12 text-black mb-4 animate-bounce" />
              <h4 className="font-extrabold text-xl mb-2">{f.title}</h4>
              <p className="text-black text-lg font-semibold">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Galeri */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Galeri Kegiatan</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.img 
              key={i} 
              src={`https://picsum.photos/400/300?random=${i+1}`} 
              alt={`Galeri ${i+1}`} 
              className="rounded-2xl shadow-2xl hover:scale-110 transition-transform"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.section>

      {/* Testimoni */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Testimoni Pengguna</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="bg-gradient-to-tr from-cream-50 via-red-100 to-red-500 rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <p className="italic text-black mb-4">“{t.text}”</p>
              <p className="font-extrabold text-black text-right">- {t.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tim Developer */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-3xl font-extrabold mb-6 text-center">Tim Developer</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((d, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center rounded-2xl shadow-2xl p-4 bg-gradient-to-br from-cream-50 via-red-200 to-red-700 hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <img src={d.img} alt={d.name} className="w-24 h-24 rounded-full mb-3 shadow-lg" />
              <h4 className="font-extrabold text-black">{d.name}</h4>
              <p className="text-black font-semibold">{d.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Kontak */}
      <motion.section 
        className="p-6 rounded-3xl shadow-lg text-center space-y-3 bg-gradient-to-tr from-cream-50 via-red-200 to-red-700"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-3xl font-extrabold text-center">Hubungi Kami</h3>
        <p className="text-black font-semibold">Punya pertanyaan atau ingin bekerjasama? Silakan hubungi kami.</p>
        <div className="flex justify-center gap-6 mt-4 text-lg font-semibold">
          <div className="flex items-center gap-2 text-black hover:text-gray-900 transition-colors">
            <PhoneIcon className="w-5 h-5 animate-bounce" />
            <span>(021) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-black hover:text-gray-900 transition-colors">
            <EnvelopeIcon className="w-5 h-5 animate-bounce" />
            <span>support@goodteacher.ac.id</span>
          </div>
        </div>
      </motion.section>

    </div>
  );
}

export default About;
