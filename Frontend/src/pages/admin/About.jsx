import { AcademicCapIcon, GlobeAltIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline";

function About() {
  return (
    <div className="p-6 font-sans text-slate-800 space-y-10">
      {/* Section 1: Header */}
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-red-900">Tentang Sistem</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Sistem Informasi Penilaian Kinerja Guru oleh Siswa adalah platform digital
          yang dirancang untuk meningkatkan transparansi, akuntabilitas, dan kualitas
          pendidikan di sekolah/universitas. Dengan sistem ini, siswa dapat memberikan
          feedback, sementara pihak kesiswaan/BK dapat memantau dan menganalisis kinerja guru.
        </p>
      </header>

      {/* Section 2: Profil Sekolah */}
      <section className="bg-red-50 p-6 rounded-lg shadow">
        <h3 className="text-2xl font-semibold text-red-800 mb-4">Profil Sekolah</h3>
        <p>
          <strong>SMA/Universitas Good Teacher</strong> berdiri sejak tahun 1995, berkomitmen
          untuk mencetak generasi unggul yang berkarakter, kreatif, dan inovatif. 
          Saat ini terdapat lebih dari <span className="font-bold">2.500 siswa</span> 
          dan <span className="font-bold">120 guru</span> aktif yang menggunakan sistem digital
          dalam kegiatan akademik.
        </p>
        <ul className="mt-4 list-disc ml-6 text-slate-700">
          <li>Alamat: Jl. Pendidikan No. 123, Jakarta, Indonesia</li>
          <li>Email: info@goodteacher.ac.id</li>
          <li>Telp: (021) 123-4567</li>
          <li>Website: <a href="https://www.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">kemdikbud.go.id</a></li>
        </ul>
      </section>

      {/* Section 3: Fitur Utama */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Fitur Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
            <AcademicCapIcon className="w-12 h-12 text-red-700 mb-2" />
            <h4 className="font-bold">Manajemen Data</h4>
            <p>CRUD data guru, siswa, fakultas, jurusan, mata pelajaran, dan pertanyaan kuisioner.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
            <UserGroupIcon className="w-12 h-12 text-red-700 mb-2" />
            <h4 className="font-bold">Penilaian Guru</h4>
            <p>Siswa dapat memberikan feedback kuisioner terhadap guru dengan aman & transparan.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
            <ChartBarIcon className="w-12 h-12 text-red-700 mb-2" />
            <h4 className="font-bold">Laporan & Statistik</h4>
            <p>Laporan interaktif, grafik skor, filter data berdasarkan jurusan, semester, & mapel.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
            <GlobeAltIcon className="w-12 h-12 text-red-700 mb-2" />
            <h4 className="font-bold">Akses Online</h4>
            <p>Seluruh data dapat diakses secara online melalui web yang responsif & mobile-friendly.</p>
          </div>
        </div>
      </section>

      {/* Section 4: Galeri Gambar */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Galeri Kegiatan</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <img
              key={i}
              src={`https://picsum.photos/300/200?random=${i + 1}`}
              alt={`Galeri ${i + 1}`}
              className="rounded-lg shadow hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </section>

      {/* Section 5: Referensi */}
      <section>
        <h3 className="text-2xl font-semibold text-red-800 mb-6">Referensi Pendidikan</h3>
        <ul className="list-disc ml-6 space-y-2 text-slate-700">
          <li><a href="https://kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Kementerian Pendidikan dan Kebudayaan</a></li>
          <li><a href="https://kampusmerdeka.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Kampus Merdeka</a></li>
          <li><a href="https://pusdatin.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Pusdatin Kemendikbud</a></li>
          <li><a href="https://belajar.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Belajar.id</a></li>
          <li><a href="https://dikti.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Ditjen Dikti</a></li>
          <li><a href="https://sinta.kemdikbud.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Sinta</a></li>
          <li><a href="https://perpusnas.go.id" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Perpustakaan Nasional</a></li>
          <li><a href="https://scholar.google.com" target="_blank" rel="noreferrer" className="text-red-700 hover:underline">Google Scholar</a></li>
        </ul>
      </section>
    </div>
  );
}

export default About;
