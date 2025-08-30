import { useState, useEffect } from "react"; // Import hook useState dan useEffect dari React
import { 
  AcademicCapIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  TrophyIcon,
  LightBulbIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  XMarkIcon
} from "@heroicons/react/24/outline"; // Import berbagai icon dari Heroicons

function About() {
  const [activeTab, setActiveTab] = useState("sejarah"); // State untuk mengelola tab aktif
  const [showVideoModal, setShowVideoModal] = useState(false); // State untuk mengontrol tampilan modal video
  const [stats, setStats] = useState({ // State untuk data statistik dengan nilai awal 0
    teachers: 0,
    students: 0,
    feedbacks: 0,
    courses: 0
  });

  // Animasi counter untuk statistik
  useEffect(() => {
    const targetStats = { // Nilai target untuk statistik
      teachers: 120,
      students: 2500,
      feedbacks: 12500,
      courses: 45
    };

    const duration = 2000; // ms - durasi animasi
    const interval = 20; // ms - interval update
    const steps = duration / interval; // Jumlah langkah animasi
    
    const counters = {}; // Objek untuk melacak counter setiap statistik
    Object.keys(targetStats).forEach(key => { // Inisialisasi counter untuk setiap statistik
      counters[key] = {
        current: 0,
        target: targetStats[key],
        step: targetStats[key] / steps // Nilai kenaikan per langkah
      };
    });

    let stepCount = 0; // Counter langkah
    const counterInterval = setInterval(() => { // Set interval untuk animasi
      stepCount++;
      
      const updatedStats = {}; // Objek untuk statistik yang akan diupdate
      Object.keys(counters).forEach(key => { // Update setiap statistik
        if (counters[key].current < counters[key].target) {
          updatedStats[key] = Math.min( // Pastikan tidak melebihi target
            counters[key].current + counters[key].step,
            counters[key].target
          );
          counters[key].current = updatedStats[key]; // Update nilai counter
        } else {
          updatedStats[key] = counters[key].current; // Jika sudah mencapai target
        }
      });
      
      setStats(prev => ({ ...prev, ...updatedStats })); // Update state stats
      
      if (stepCount >= steps) { // Hentikan interval jika sudah selesai
        clearInterval(counterInterval);
      }
    }, interval);

    return () => clearInterval(counterInterval); // Cleanup interval pada unmount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 font-sans text-slate-800">
      {/* Header Section dengan Background Gradient */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Sistem Penilaian Guru</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Platform digital inovatif untuk meningkatkan transparansi, akuntabilitas, 
            dan kualitas pendidikan melalui umpan balik konstruktif dari siswa
          </p>
          <button 
            onClick={() => setShowVideoModal(true)} // Tampilkan modal video saat diklik
            className="mt-8 inline-flex items-center gap-2 bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all transform hover:scale-105"
          >
            <PlayIcon className="w-5 h-5" /> Tonton Video Presentasi
          </button>
        </div>
      </div>

{/* Modal Video */}
{showVideoModal && ( // Tampilkan modal jika showVideoModal true
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Video Presentasi Sistem</h3>
        <button 
          onClick={() => setShowVideoModal(false)} // Tutup modal saat diklik
          className="text-slate-500 hover:text-slate-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      {/* Video Embed YouTube */}
      <div className="aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/dGcsHMXbSOA?autoplay=1" // URL video YouTube
          title="Video Presentasi"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </div>
)}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {/* Statistik Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-red-600">
            <UserGroupIcon className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-800">{Math.round(stats.teachers)}</div> {/* Tampilkan jumlah guru */}
            <p className="text-slate-600">Guru</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-blue-600">
            <AcademicCapIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-800">{Math.round(stats.students)}</div> {/* Tampilkan jumlah siswa */}
            <p className="text-slate-600">Siswa</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-green-600">
            <ChartBarIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-800">{Math.round(stats.feedbacks)}</div> {/* Tampilkan jumlah feedback */}
            <p className="text-slate-600">Umpan Balik</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-purple-600">
            <BookOpenIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-800">{Math.round(stats.courses)}</div> {/* Tampilkan jumlah mata pelajaran */}
            <p className="text-slate-600">Mata Pelajaran</p>
          </div>
        </section>

        {/* Profil Sekolah Section */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Profil Sekolah</h2>
              <p className="text-lg text-slate-600 mb-6">
                <strong className="text-red-700"> Good Teacher</strong> berdiri sejak tahun 1995, 
                berkomitmen untuk mencetak generasi unggul yang berkarakter, kreatif, dan inovatif.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <BuildingLibraryIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Visi</h4>
                    <p className="text-slate-600">Menjadi institusi pendidikan unggulan yang mencetak generasi berkarakter dan kompetitif</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <LightBulbIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Misi</h4>
                    <p className="text-slate-600">Menyelenggarakan pendidikan berkualitas dengan pendekatan student-centered learning</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <TrophyIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Prestasi</h4>
                    <p className="text-slate-600">Sekolah berakreditasi A dengan berbagai penghargaan nasional</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-red-50 p-8 md:p-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Informasi Kontak</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-700">Alamat</h4>
                  <p className="text-slate-600">Jl. Pendidikan No. 123, Jakarta, Indonesia</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700">Email</h4>
                  <p className="text-slate-600">info@goodteacher.ac.id</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700">Telepon</h4>
                  <p className="text-slate-600">(021) 123-4567</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700">Website</h4>
                  <a 
                    href="https://www.kemdikbud.go.id" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-red-700 hover:underline flex items-center gap-1"
                  >
                    kemdikbud.go.id <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Jam Operasional</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Senin - Jumat</span>
                    <span className="text-slate-600">07:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Sabtu</span>
                    <span className="text-slate-600">08:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Minggu</span>
                    <span className="text-slate-600">Tutup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fitur Utama Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Fitur Utama Sistem</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Platform kami menawarkan berbagai fitur canggih untuk mendukung proses penilaian 
              dan pengembangan kualitas pengajaran
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-red-600">
              <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <AcademicCapIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Manajemen Data</h3>
              <p className="text-slate-600">
                Kelola data guru, siswa, fakultas, jurusan, mata pelajaran, dan pertanyaan kuisioner dengan mudah.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-blue-600">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Penilaian Guru</h3>
              <p className="text-slate-600">
                Siswa dapat memberikan feedback kuisioner terhadap guru dengan aman & transparan.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-green-600">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Laporan & Statistik</h3>
              <p className="text-slate-600">
                Laporan interaktif, grafik skor, filter data berdasarkan jurusan, semester, & mapel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-l-4 border-purple-600">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <GlobeAltIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Akses Online</h3>
              <p className="text-slate-600">
                Seluruh data dapat diakses secara online melalui web yang responsif & mobile-friendly.
              </p>
            </div>
          </div>
        </section>

        {/* Sejarah & Informasi Section dengan Tabs */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex overflow-x-auto -mb-px">
              {[ // Daftar tab yang tersedia
                { id: "sejarah", label: "Sejarah" },
                { id: "tujuan", label: "Tujuan" },
                { id: "manfaat", label: "Manfaat" },
                { id: "teknologi", label: "Teknologi" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} // Set tab aktif saat diklik
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-red-600 text-red-600" : "border-transparent text-slate-600 hover:text-slate-800"}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === "sejarah" && ( // Konten untuk tab Sejarah
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Sejarah Pengembangan Sistem</h3>
                <p className="text-slate-600 mb-6">
                  Sistem Penilaian Kinerja Guru oleh Siswa dikembangkan sejak tahun 2020 sebagai respons 
                  terhadap kebutuhan akan transparansi dan akuntabilitas dalam proses pendidikan. 
                  Awalnya sistem ini merupakan pilot project di SMA Good Teacher sebelum diperluas 
                  ke institusi pendidikan lainnya.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">2020</div>
                    <p className="text-slate-700">Tahun dimulainya pengembangan sistem</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">15+</div>
                    <p className="text-slate-700">Sekolah telah menggunakan sistem ini</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
                    <p className="text-slate-700">Tingkat kepuasan pengguna</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "tujuan" && ( // Konten untuk tab Tujuan
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Tujuan Sistem</h3>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Meningkatkan transparansi dalam proses penilaian kinerja guru</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Memberikan akses kepada siswa untuk menyampaikan umpan balik secara konstruktif</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Menyediakan data analitik untuk pengambilan keputusan yang berbasis data</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-600 rounded-full p-2 mr-4 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Mendorong peningkatan kualitas pengajaran secara berkelanjutan</span>
                  </li>
                </ul>
              </div>
            )}
            
            {activeTab === "manfaat" && ( // Konten untuk tab Manfaat
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Manfaat Sistem</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Bagi Guru</h4>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                        </div>
                        <span>Umpan balik langsung untuk perbaikan metode mengajar</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                        </div>
                        <span>Pengakuan atas kinerja yang baik</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                        </div>
                        <span>Data untuk pengembangan profesional</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Bagi Siswa</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start">
                        <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-green-600"></div>
                        </div>
                        <span>Suara didengar dalam proses pendidikan</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-green-600"></div>
                        </div>
                        <span>Proses belajar mengajar yang lebih berkualitas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-100 text-green-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-green-600"></div>
                        </div>
                        <span>Pengalaman memberikan umpan balik yang konstruktif</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">Bagi Sekolah</h4>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-start">
                        <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                        </div>
                        <span>Data untuk evaluasi dan pengambilan keputusan</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                        </div>
                        <span>Peningkatan kualitas pendidikan secara keseluruhan</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-purple-600"></div>
                        </div>
                        <span>Akuntabilitas dan transparansi institusi</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "teknologi" && ( // Konten untuk tab Teknologi
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Teknologi yang Digunakan</h3>
                <p className="text-slate-600 mb-6">
                  Sistem ini dibangun dengan teknologi modern untuk memastikan keamanan, 
                  kecepatan, dan pengalaman pengguna yang optimal.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ // Daftar teknologi yang digunakan
                    { name: "React JS", color: "bg-blue-100 text-blue-800" },
                    { name: "Node.js", color: "bg-green-100 text-green-800" },
                    { name: "PostgreSQL", color: "bg-blue-100 text-blue-800" },
                    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
                    { name: "Spring Boot", color: "bg-green-100 text-green-800" },
                    { name: "MongoDB", color: "bg-green-100 text-green-800" },
                    { name: "Docker", color: "bg-blue-100 text-blue-800" },
                    { name: "AWS", color: "bg-orange-100 text-orange-800" }
                  ].map((tech, index) => (
                    <div key={index} className={`p-3 rounded-lg text-center font-medium ${tech.color}`}>
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Galeri Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Galeri Kegiatan</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Dokumentasi berbagai kegiatan dan implementasi sistem di lingkungan sekolah
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => ( // Generate 10 gambar galeri
              <div key={i} className="relative group overflow-hidden rounded-xl cursor-pointer">
                <img
                  src={`https://picsum.photos/300/200?random=${i + 1}`} // URL gambar acak dari picsum
                  alt={`Galeri ${i + 1}`}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" // Efek zoom saat hover
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium text-sm">Lihat Detail</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="text-red-600 font-semibold hover:text-red-800 transition-colors">
              Lihat Galeri Lengkap →
            </button>
          </div>
        </section>

        {/* Referensi Section */}
        <section className="bg-slate-800 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Referensi Pendidikan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-red-300 mb-3">Sumber Daya Pendidikan</h3>
              <ul className="space-y-2">
                {[ // Daftar sumber daya pendidikan
                  { name: "Kementerian Pendidikan dan Kebudayaan", url: "https://kemdikbud.go.id" },
                  { name: "Kampus Merdeka", url: "https://kampusmerdeka.kemdikbud.go.id" },
                  { name: "Pusdatin Kemendikbud", url: "https://pusdatin.kemdikbud.go.id" },
                  { name: "Belajar.id", url: "https://belajar.id" }
                ].map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-white hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      {resource.name} <ArrowTopRightOnSquareIcon className="w-4 h-4" /> {/* Icon external link */}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-300 mb-3">Sumber Daya Penelitian</h3>
              <ul className="space-y-2">
                {[ // Daftar sumber daya penelitian
                  { name: "Ditjen Dikti", url: "https://dikti.kemdikbud.go.id" },
                  { name: "Sinta", url: "https://sinta.kemdikbud.go.id" },
                  { name: "Perpustakaan Nasional", url: "https://perpusnas.go.id" },
                  { name: "Google Scholar", url: "https://scholar.google.com" }
                ].map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-white hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      {resource.name} <ArrowTopRightOnSquareIcon className="w-4 h-4" /> {/* Icon external link */}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About; // Export komponen About