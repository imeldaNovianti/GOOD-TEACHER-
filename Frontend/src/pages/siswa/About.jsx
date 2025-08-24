import { AcademicCapIcon, GlobeAltIcon, UserGroupIcon, ChartBarIcon, CheckCircleIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function About() {
  return (
    <div className="p-6 font-sans text-slate-800 space-y-12">
      {/* Section 1: Header */}
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-red-900">Tentang Aplikasi GoodTeacher</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          <span className="font-semibold text-red-700">GoodTeacher</span> adalah sistem informasi penilaian kinerja guru 
          oleh siswa. Aplikasi ini hadir untuk meningkatkan <strong>transparansi</strong>, 
          <strong> akuntabilitas</strong>, dan <strong>partisipasi siswa</strong> dalam dunia pendidikan.  
          Dengan GoodTeacher, setiap siswa dapat memberikan feedback yang konstruktif dan 
          pihak sekolah dapat memantau serta meningkatkan kualitas pembelajaran.
        </p>
      </header>

      {/* Section 2: Profil Sekolah */}
      <section className="bg-red-50 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold text-red-800 mb-4">Profil Sekolah</h3>
        <p>
          <strong>SMA/Universitas Good Teacher</strong> berdiri sejak tahun 1995 dengan visi mencetak 
          generasi unggul yang berkarakter, kreatif, dan inovatif. Saat ini terdapat lebih dari{" "}
          <span className="font-bold">2.500 siswa</span> dan <span className="font-bold">120 guru</span> 
          aktif. Semua aktivitas akademik sudah terdigitalisasi, termasuk penilaian kinerja guru.
        </p>
        <ul className="mt-4 list-disc ml-6 text-slate-700">
          <li>Alamat: Jl. Pendidikan No. 123, Jakarta, Indonesia</li>
          <li>Email: info@goodteacher.ac.id</li>
          <li>Telp: (021) 123-4567</li>
          <li>Website: <a href="https://www.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">kemdikbud.go.id</a></li>
        </ul>
      </section>

      {/* Section 3: Visi & Misi */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Visi & Misi</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white shadow rounded-lg">
            <h4 className="font-bold text-red-700 mb-2">Visi</h4>
            <p>
              Menjadi sekolah unggulan yang mengutamakan kualitas pengajaran dengan memanfaatkan 
              teknologi digital untuk meningkatkan kinerja guru dan keterlibatan siswa.
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h4 className="font-bold text-red-700 mb-2">Misi</h4>
            <ul className="list-disc ml-6 space-y-2">
              <li>Meningkatkan transparansi penilaian kinerja guru.</li>
              <li>Mendorong keterlibatan siswa dalam evaluasi pembelajaran.</li>
              <li>Menyediakan laporan data yang akurat untuk pihak sekolah.</li>
              <li>Mendukung inovasi berbasis digital dalam dunia pendidikan.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Fitur */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Fitur Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: AcademicCapIcon, title: "Manajemen Data", desc: "CRUD siswa, guru, fakultas, jurusan, mata pelajaran, dan pertanyaan." },
            { icon: UserGroupIcon, title: "Penilaian Guru", desc: "Siswa mengisi kuisioner kinerja guru dengan mudah & aman." },
            { icon: ChartBarIcon, title: "Laporan Statistik", desc: "Grafik skor guru, filter data, dan download laporan PDF." },
            { icon: CheckCircleIcon, title: "Gamifikasi", desc: "Progress bar kuisioner dan achievement untuk motivasi siswa." },
            { icon: GlobeAltIcon, title: "Akses Online", desc: "Aplikasi berbasis web, responsif & mobile-friendly." },
            { icon: AcademicCapIcon, title: "Audit Trail", desc: "Catat semua aktivitas penting agar lebih transparan." }
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <f.icon className="w-12 h-12 text-red-700 mb-3" />
              <h4 className="font-bold text-lg mb-2">{f.title}</h4>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Galeri */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Galeri Kegiatan</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <img
              key={i}
              src={`https://picsum.photos/400/300?random=${i + 1}`}
              alt={`Galeri ${i + 1}`}
              className="rounded-lg shadow hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </section>

      {/* Section 6: Referensi */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Referensi Pendidikan</h3>
        <ul className="list-disc ml-6 space-y-2 text-slate-700">
          <li><a href="https://kemdikbud.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Kementerian Pendidikan & Kebudayaan</a></li>
          <li><a href="https://kampusmerdeka.kemdikbud.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Kampus Merdeka</a></li>
          <li><a href="https://pusdatin.kemdikbud.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Pusdatin Kemendikbud</a></li>
          <li><a href="https://belajar.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Belajar.id</a></li>
          <li><a href="https://dikti.kemdikbud.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Ditjen Dikti</a></li>
          <li><a href="https://sinta.kemdikbud.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Sinta</a></li>
          <li><a href="https://perpusnas.go.id" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Perpustakaan Nasional</a></li>
          <li><a href="https://scholar.google.com" className="text-red-700 hover:underline" target="_blank" rel="noreferrer">Google Scholar</a></li>
        </ul>
      </section>

      {/* Section 7: Testimoni */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Testimoni Pengguna</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Haikal - Siswa", text: "GoodTeacher bikin penilaian guru jadi mudah dan transparan. Aku suka fitur progress bar!" },
            { name: "Bapak Andi - Guru", text: "Feedback dari siswa sangat membantu saya memperbaiki metode mengajar." },
            { name: "Ibu Sari - BK", text: "Laporan dan filter datanya sangat membantu dalam evaluasi guru secara menyeluruh." }
          ].map((t, i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
              <p className="italic text-slate-600 mb-2">“{t.text}”</p>
              <p className="font-bold text-red-700">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Tim Developer */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Tim Developer</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Haikal Mardiansyah", role: "Fullstack Developer", img: "https://picsum.photos/200?random=11" },
            { name: "Rina Putri", role: "Frontend Engineer", img: "https://picsum.photos/200?random=12" },
            { name: "Budi Santoso", role: "Backend Engineer", img: "https://picsum.photos/200?random=13" }
          ].map((d, i) => (
            <div key={i} className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:scale-105 transition">
              <img src={d.img} alt={d.name} className="w-24 h-24 rounded-full mb-3 shadow" />
              <h4 className="font-bold text-lg text-red-700">{d.name}</h4>
              <p className="text-slate-600">{d.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: Kontak */}
      <section className="bg-red-50 p-6 rounded-lg shadow text-center space-y-3">
        <h3 className="text-2xl font-semibold text-red-800">Hubungi Kami</h3>
        <p className="text-slate-600">Punya pertanyaan atau ingin bekerjasama? Silakan hubungi kami.</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-red-700">
            <PhoneIcon className="w-5 h-5" />
            <span>(021) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-red-700">
            <EnvelopeIcon className="w-5 h-5" />
            <span>support@goodteacher.ac.id</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
