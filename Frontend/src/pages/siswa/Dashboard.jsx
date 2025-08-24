import { Link } from "react-router-dom";

function Home() {
  const infoCards = [
    {
      title: "Laporan",
      desc: "Cek rekap skor dan performa belajarmu.",
      img: "https://source.unsplash.com/300x200/?report,chart",
      link: "/siswa/laporan",
      color: "bg-red-50 hover:bg-red-100",
    },
    {
      title: "About",
      desc: "Pelajari lebih lanjut tentang GoodTeacher dan tim pengembang.",
      img: "https://source.unsplash.com/300x200/?school,teacher",
      link: "/siswa/about",
      color: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Kuisioner",
      desc: "Isi kuisioner untuk membantu guru meningkatkan kualitas pembelajaran.",
      img: "https://source.unsplash.com/300x200/?questionnaire,study",
      link: "/siswa/kuisioner",
      color: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      title: "Berita & Tips",
      desc: "Dapatkan info terbaru, tips belajar, dan rekomendasi materi.",
      img: "https://source.unsplash.com/300x200/?education,news",
      link: "/siswa/berita",
      color: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Prestasi",
      desc: "Lihat pencapaianmu dan guru terbaik di sekolah.",
      img: "https://source.unsplash.com/300x200/?trophy,achievement",
      link: "/siswa/prestasi",
      color: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "Forum Diskusi",
      desc: "Bertanya dan berdiskusi dengan teman atau guru.",
      img: "https://source.unsplash.com/300x200/?forum,discussion",
      link: "/siswa/forum",
      color: "bg-pink-50 hover:bg-pink-100",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-900 mb-2">Selamat Datang di GoodTeacher!</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Jelajahi berbagai informasi, materi, kuisioner, dan pencapaianmu di halaman ini.
        </p>
      </div>

      {/* Card Info */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`p-4 rounded-lg shadow-lg flex flex-col justify-between transition transform hover:scale-105 ${card.color}`}
          >
            <img src={card.img} alt={card.title} className="rounded mb-3 h-40 w-full object-cover" />
            <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Banner / Iklan / Promo */}
      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-r from-red-400 to-yellow-400 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-2">Promo Spesial!</h2>
          <p className="text-sm mb-4">Ikuti kuisioner minggu ini dan dapatkan badge prestasi khusus!</p>
          <Link to="/siswa/prestasi" className="bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
            Lihat Prestasi
          </Link>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-green-400 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-2">Tips Belajar</h2>
          <p className="text-sm mb-4">Dapatkan tips belajar efektif dari guru terbaik sekolah.</p>
          <Link to="/siswa/berita" className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">
            Baca Sekarang
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">
        © {new Date().getFullYear()} GoodTeacher. All rights reserved.
      </div>
    </div>
  );
}

export default Home;
