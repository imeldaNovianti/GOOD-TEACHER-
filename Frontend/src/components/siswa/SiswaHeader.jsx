import { Link, useLocation } from "react-router-dom"; 
// Link = navigasi antar halaman, useLocation = cek URL aktif
import {
  FaHome, FaClipboardList, FaChartPie, FaUser,
  FaMedal, FaInfoCircle, FaSignOutAlt
} from "react-icons/fa"; 
// Import ikon dari react-icons
import { logout } from "../../utils/auth"; 
// Import fungsi logout
import Logo from "../../assets/2-removebg-preview.png"; 
// Import logo aplikasi

function SiswaHeader() {
  const location = useLocation(); 
  // Hook untuk mengetahui lokasi (URL) saat ini

  const navItems = [ 
    // Daftar menu navigasi siswa
    { name: "Home", icon: <FaHome />, link: "/siswa/dashboard" },
    { name: "Isi Kuisioner", icon: <FaClipboardList />, link: "/siswa/kuisioner" },
    { name: "Hasil", icon: <FaChartPie />, link: "/siswa/hasil" },
    { name: "Profile", icon: <FaUser />, link: "/siswa/profile" },
    { name: "Voice & Card", icon: <FaMedal />, link: "/siswa/achievement" },
    { name: "About", icon: <FaInfoCircle />, link: "/siswa/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black/70 via-red-900/70 to-yellow-900/70 backdrop-blur-xl border-b border-yellow-500/30 shadow-lg">
      {/* Header tetap di atas layar, dengan gradient background + efek blur */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Kontainer header, flex antara logo dan menu */}

        {/* 🔹 Logo */}
        <Link to="/siswa/dashboard" className="flex items-center gap-3 group">
          {/* Logo + teks, menuju dashboard */}
          <img
            src={Logo} 
            alt="Logo" 
            className="h-17 w-auto drop-shadow-[0_0_12px_rgba(255,215,0,0.6)] transition-transform duration-300 group-hover:scale-110"
          />
          <h1 className="font-extrabold text-xl tracking-wide text-white">
            <span className="text-yellow-400"></span>
            <span className="ml-2 text-sm text-gray-300 font-light">| Siswa Panel</span>
          </h1>
        </Link>

        {/* 🔹 Navigation */}
        <nav className="hidden md:flex gap-8 font-semibold text-white">
          {/* Menu navigasi, hanya tampil di layar >= md */}
          {navItems.map((item, i) => (
            <Link
              key={i} 
              to={item.link} 
              className={`relative flex items-center gap-2 transition-all duration-300 ${
                location.pathname === item.link
                  ? "text-yellow-400 scale-110" 
                  : "hover:text-yellow-300 hover:scale-105"
              }`}
            >
              {item.icon} {item.name} 
              {/* Tampilkan ikon + nama menu */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-400 transition-all duration-300 ${
                  location.pathname === item.link ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
              {/* Animasi underline jika aktif */}
            </Link>
          ))}
        </nav>

        {/* 🔹 Logout */}
        <button
          onClick={logout} 
          // panggil fungsi logout
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-yellow-600 to-red-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-yellow-400/40 transform hover:scale-105 transition duration-300"
        >
          <FaSignOutAlt /> Logout 
          {/* Tampilkan ikon + teks logout */}
        </button>
      </div>
    </header>
  );
}

export default SiswaHeader; 
// Export agar bisa digunakan di layout siswa
