import { useEffect, useState } from "react";

import { motion } from "framer-motion";

//  Heroicons
import { 
  AcademicCapIcon,  // Icon topi akademik, biasanya untuk pendidikan
  GlobeAltIcon,     // Icon globe, untuk global/website
  UserGroupIcon,    // Icon kelompok orang, untuk user/anggota
  ChartBarIcon,     // Icon chart bar, untuk statistik
  CheckCircleIcon,  // Icon ceklis lingkaran, untuk tanda selesai/valid
  PhoneIcon,        // Icon telepon
  EnvelopeIcon,     // Icon amplop/email
  HeartIcon,        // Icon hati, biasanya untuk kepuasan/penghargaan
  LightBulbIcon,    // Icon lampu, untuk ide/visi
  ShieldCheckIcon,  // Icon perisai dengan ceklis, untuk keamanan/audit
  ChartPieIcon,     // Icon pie chart, untuk laporan/analisis
  ArrowTrendingUpIcon, // Icon panah naik, untuk pertumbuhan/misi
  UserCircleIcon,   // Icon lingkaran orang, untuk user/testimoni
  ClockIcon,        // Icon jam, bisa digunakan untuk timeline/event
  DocumentChartBarIcon, // Icon dokumen + chart, untuk laporan
  CakeIcon,         // Icon kue, bisa untuk milestone/anniversary
  BuildingLibraryIcon, // Icon gedung, untuk sekolah/instansi
  MapPinIcon,       // Icon pin lokasi
  DevicePhoneMobileIcon, // Icon hp, untuk kontak
  ArrowPathIcon,    // Icon panah melingkar, untuk progress/refresh
  LockClosedIcon,   // Icon gembok, untuk keamanan
  CloudIcon         // Icon awan, untuk cloud/web
} from "@heroicons/react/24/outline";

// ===================== TypeWriter Component =====================
// Component untuk animasi pengetikan teks (efek "typing")
function TypeWriter({ text, speed = 100 }) {
  const [displayed, setDisplayed] = useState(""); // State untuk teks yang sedang ditampilkan

  // useEffect untuk menampilkan teks satu per satu sesuai kecepatan
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1)); // Ambil substring sampai i
      i++;
      if (i === text.length) clearInterval(interval); // Stop interval saat selesai
    }, speed);
    return () => clearInterval(interval); // Bersihkan interval saat unmount
  }, [text, speed]);

  // Render teks yang sedang diketik
  return <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{displayed}</h2>;
}

// ===================== Stats Counter Component =====================
// Component untuk menghitung angka secara animasi dari 0 ke target
function Counter({ end, duration = 2 }) {
  const [count, setCount] = useState(0); // State untuk nilai counter saat ini
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // Hitung increment per frame (asumsi 60 fps)
    const timer = setInterval(() => {
      start += increment; // Tambah start
      if (start >= end) {
        setCount(end); // Pastikan tidak lebih dari end
        clearInterval(timer); // Hentikan interval
      } else {
        setCount(Math.floor(start)); // Update count
      }
    }, 1000 / 60); // 60 fps
    
    return () => clearInterval(timer); // Bersihkan interval saat unmount
  }, [end, duration]);
  
  return <span className="text-4xl font-bold text-white">{count}+</span>; // Render angka
}

// ===================== About Component =====================
function About() {
  // Array fitur utama untuk ditampilkan
  const features = [
    { icon: AcademicCapIcon, title: "Manajemen Data Terpadu", desc: "Kelola data siswa, guru, fakultas, jurusan, mata pelajaran, dan pertanyaan dengan sistem CRUD yang lengkap." },
    { icon: UserGroupIcon, title: "Penilaian Guru yang Objektif", desc: "Siswa dapat mengisi kuisioner penilaian kinerja guru dengan mudah, cepat, dan terjamin kerahasiaannya." },
    { icon: ChartBarIcon, title: "Analisis & Laporan Statistik", desc: "Grafik skor guru, filter data canggih, dan kemampuan download laporan dalam format PDF." },
    { icon: CheckCircleIcon, title: "Sistem Gamifikasi", desc: "Progress bar kuisioner dan achievement system untuk meningkatkan motivasi partisipasi siswa." },
    { icon: GlobeAltIcon, title: "Akses Online Terintegrasi", desc: "Aplikasi berbasis web yang responsif dan mobile-friendly, dapat diakses kapan saja dan di mana saja." },
    { icon: ShieldCheckIcon, title: "Audit Trail Lengkap", desc: "Mencatat semua aktivitas penting secara detail untuk memastikan transparansi dan akuntabilitas." }
  ];

  // Array tim developer
  const team = [
    { name: "Haikal Mardiansyah", role: "Fullstack Developer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?..." },
    { name: "Rina Putri", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?..." },
    { name: "Budi Santoso", role: "Backend Engineer", img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?..." },
    { name: "Sari Indah", role: "Data Analyst", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?..." }
  ];

  // Array testimonial pengguna
  const testimonials = [
    { name: "jungkook - Siswa Kelas XII", text: "GoodTeacher bikin penilaian guru jadi mudah ...", rating: 5 },
    { name: "jimin - Guru Matematika", text: "Feedback dari siswa sangat membantu ...", rating: 4 },
    { name: "iu - Staff BK", text: "Laporan dan filter datanya sangat membantu ...", rating: 5 },
    { name: "suga - Kepala Sekolah", text: "GoodTeacher memberikan wawasan berharga ...", rating: 5 }
  ];

  // Array milestone/timeline GoodTeacher
  const milestones = [
    { year: "2020", event: "Ide Awal GoodTeacher", desc: "Lahirnya konsep sistem penilaian guru digital" },
    { year: "2021", event: "Pengembangan Prototype", desc: "Riset dan pengembangan versi awal aplikasi" },
    { year: "2022", event: "Pilot Project", desc: "Uji coba di 3 sekolah dengan hasil memuaskan" },
    { year: "2023", event: "Launching Versi 2.0", desc: "Peluncuran versi lengkap dengan fitur gamifikasi" },
    { year: "2024", event: "Ekspansi Nasional", desc: "Diadopsi oleh 50+ sekolah di seluruh Indonesia" }
  ];

  // Array statistik untuk angka-angka penting
  const stats = [
    { value: 2500, label: "Siswa Aktif", icon: UserGroupIcon },
    { value: 120, label: "Guru Terdaftar", icon: AcademicCapIcon },
    { value: 15, label: "Sekolah Mitra", icon: BuildingLibraryIcon },
    { value: 98, label: "Kepuasan Pengguna", icon: HeartIcon }
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-br from-[#500000] via-[#800020] to-[#a53860]">
      {/* ================= Header ================= */}
      <motion.header 
        className="relative py-20 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background gelap overlay */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?...')] bg-cover bg-center"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Animasi judul */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TypeWriter text="Tentang GoodTeacher" speed={100} />
          </motion.div>
          
          {/* Deskripsi */}
          <motion.p 
            className="text-xl text-white mt-6 max-w-3xl mx-auto font-medium leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            GoodTeacher adalah platform inovatif untuk penilaian kinerja guru oleh siswa. 
            Memberikan <strong className="text-yellow-300">transparansi</strong>, <strong className="text-yellow-300">akuntabilitas</strong>, 
            dan <strong className="text-yellow-300">partisipasi aktif</strong> dalam peningkatan kualitas pendidikan.
          </motion.p>
        </div>
      </motion.header>
      
      {/* ================= Stats Section ================= */}
      <motion.section 
        className="py-12 bg-white bg-opacity-90"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#800020]">GoodTeacher dalam Angka</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 bg-gradient-to-br from-[#800020] to-[#a53860] rounded-2xl shadow-lg text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stat.label === "Kepuasan Pengguna" ? `${stat.value}%` : <Counter end={stat.value} />}
                </div>
                <p className="text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* ================= Profil Sekolah ================= */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-[#f8f0f0] to-[#f5e1e1]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Dekorasi lingkaran transparan di background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#800020] rounded-full opacity-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#800020] rounded-full opacity-10"></div>
            
            {/* Judul Profil Sekolah */}
            <h3 className="text-3xl font-bold mb-6 text-center text-[#800020]">Profil Sekolah</h3>
            {/* Deskripsi sekolah */}
            <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
              <strong className="text-2xl text-[#800020]">SMA/Universitas Good Teacher</strong> berdiri sejak 1995 ...
              <span className="font-bold text-[#800020]">2.500 siswa</span> & 
              <span className="font-bold text-[#800020]">120 guru</span> aktif.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-10">
              {/* Kolom info alamat dan email */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <MapPinIcon className="w-8 h-8 text-[#800020]" /> {/* Icon lokasi */}
                  <div>
                    <h4 className="font-bold">Alamat</h4>
                    <p>Jl. Pendidikan No. 123, Jakarta</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <EnvelopeIcon className="w-8 h-8 text-[#800020]" /> {/* Icon email */}
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p>info@goodteacher.ac.id</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Kolom info telepon dan website */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-4">
                  <PhoneIcon className="w-8 h-8 text-[#800020]" /> {/* Icon telepon */}
                  <div>
                    <h4 className="font-bold">Telepon</h4>
                    <p>(021) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <GlobeAltIcon className="w-8 h-8 text-[#800020]" /> {/* Icon website */}
                  <div>
                    <h4 className="font-bold">Website</h4>
                    <p>www.goodteacher.ac.id</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= Visi & Misi ================= */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center text-[#800020]">Visi & Misi</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi */}
            <motion.div 
              className="p-8 bg-gradient-to-br from-[#800020] to-[#a53860] text-white rounded-2xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <LightBulbIcon className="w-10 h-10 text-yellow-300" /> {/* Icon lampu */}
                <h4 className="text-2xl font-bold">Visi</h4>
              </div>
              <p className="text-lg">Menjadi platform terdepan dalam transformasi digital pendidikan ...</p>
            </motion.div>
            
            {/* Misi */}
            <motion.div 
              className="p-8 bg-gradient-to-br from-[#500000] to-[#800020] text-white rounded-2xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <ArrowTrendingUpIcon className="w-10 h-10 text-yellow-300" /> {/* Icon panah naik */}
                <h4 className="text-2xl font-bold">Misi</h4>
              </div>
              <ul className="space-y-3 text-lg">
                {/* List misi dengan ikon ceklis */}
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 mt-1 text-yellow-300 flex-shrink-0" />
                  <span>Meningkatkan transparansi dalam proses penilaian guru</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 mt-1 text-yellow-300 flex-shrink-0" />
                  <span>Mendorong partisipasi aktif siswa dalam evaluasi pembelajaran</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 mt-1 text-yellow-300 flex-shrink-0" />
                  <span>Menyediakan laporan analitik yang akurat dan mudah dipahami</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 mt-1 text-yellow-300 flex-shrink-0" />
                  <span>Mendukung inovasi digital dalam ekosistem pendidikan</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ================= Fitur Utama ================= */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-[#f8f0f0] to-[#f5e1e1]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4 text-center text-[#800020]">Fitur Utama</h3>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">GoodTeacher dilengkapi dengan berbagai fitur canggih ...</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-[#800020] border-opacity-20 hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Icon fitur */}
                <div className="w-14 h-14 bg-[#800020] bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-[#800020]" />
                </div>
                {/* Judul fitur */}
                <h4 className="text-xl font-bold mb-2 text-[#800020]">{feature.title}</h4>
                {/* Deskripsi fitur */}
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
            {/* ================= Timeline / Perjalanan GoodTeacher ================= */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }} // Awal opacity 0
        whileInView={{ opacity: 1 }} // Saat terlihat, opacity 1
        transition={{ duration: 1 }} // Durasi animasi 1 detik
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center text-[#800020]">Perjalanan GoodTeacher</h3>
          
          <div className="relative">
            {/* Garis timeline di tengah */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#800020] bg-opacity-30"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center mb-12`} // Ganti sisi kiri/kanan
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} // Animasi masuk dari kiri/kanan
                whileInView={{ opacity: 1, x: 0 }} // Saat terlihat, animasi ke posisi 0
                transition={{ duration: 0.6, delay: index * 0.2 }} // Delay berbeda tiap milestone
              >
                <div className="w-1/2 p-4">
                  {/* Card milestone */}
                  <div className={`p-6 rounded-2xl shadow-lg ${index % 2 === 0 ? 'bg-gradient-to-r from-[#800020] to-[#a53860] text-white' : 'bg-white border border-[#800020] border-opacity-20'}`}>
                    <h4 className="text-xl font-bold">{milestone.event}</h4> {/* Judul milestone */}
                    <p className="mt-2">{milestone.desc}</p> {/* Deskripsi milestone */}
                  </div>
                </div>
                
                {/* Bulatan tahun milestone */}
                <div className="w-12 h-12 bg-[#800020] rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold">{milestone.year}</span>
                </div>
                
                <div className="w-1/2 p-4"></div> {/* Spacer */}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= Testimoni ================= */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-[#500000] to-[#800020]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center text-white">Apa Kata Mereka?</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Rating bintang */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                {/* Teks testimonial */}
                <p className="italic text-gray-700 mb-4">"{testimonial.text}"</p>
                
                {/* Info pengirim testimonial */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#800020] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                    <UserCircleIcon className="w-6 h-6 text-[#800020]" /> {/* Icon user */}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#800020]">{testimonial.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= Tim Developer ================= */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4 text-center text-[#800020]">Tim Developer</h3>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">Tim profesional di balik kesuksesan GoodTeacher</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="text-center bg-gradient-to-b from-white to-[#f8f0f0] p-6 rounded-2xl shadow-lg border border-[#800020] border-opacity-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Foto anggota */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#800020] border-opacity-20">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {/* Nama & role */}
                <h4 className="text-xl font-bold text-[#800020] mb-1">{member.name}</h4>
                <p className="text-gray-600 mb-4">{member.role}</p>
                {/* Ikon kontak (email & web) */}
                <div className="flex justify-center space-x-3">
                  <div className="w-8 h-8 bg-[#800020] bg-opacity-10 rounded-full flex items-center justify-center">
                    <EnvelopeIcon className="w-4 h-4 text-[#800020]" />
                  </div>
                  <div className="w-8 h-8 bg-[#800020] bg-opacity-10 rounded-full flex items-center justify-center">
                    <GlobeAltIcon className="w-4 h-4 text-[#800020]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= CTA / Call to Action ================= */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-[#800020] to-[#500000] text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-6">Tertarik Menggunakan GoodTeacher?</h3>
          <p className="text-xl mb-8">Jadilah bagian dari transformasi digital dalam pendidikan. Hubungi kami untuk informasi lebih lanjut.</p>
          
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tombol demo */}
            <button className="px-8 py-3 bg-white text-[#800020] rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
              Demo Gratis
            </button>
            {/* Tombol kontak */}
            <button className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-[#800020] transition-colors">
              Hubungi Kami
            </button>
          </motion.div>
        </div>
      </motion.section>

    </div> // End of main div wrapper
  );
}

// ================= StarIcon Component =================
// Komponen untuk menampilkan bintang rating
function StarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      {/* Path SVG bintang */}
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default About; // Export komponen About

