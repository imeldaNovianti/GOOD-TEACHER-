import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaChartPie,
  FaUser,
  FaMedal,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../utils/auth";
import Logo from "../../assets/2-removebg-preview.png"; // import logo

function SiswaHeader() {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <FaHome />, link: "/siswa/dashboard" },
    { name: "Isi Kuisioner", icon: <FaClipboardList />, link: "/siswa/kuisioner" },
    { name: "Hasil", icon: <FaChartPie />, link: "/siswa/hasil" },
    { name: "Profile", icon: <FaUser />, link: "/siswa/profile" },
    { name: "Voice & Card", icon: <FaMedal />, link: "/siswa/achievement" },
    { name: "About", icon: <FaInfoCircle />, link: "/siswa/about" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black/70 via-red-900/70 to-yellow-900/70 backdrop-blur-xl border-b border-yellow-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/siswa/dashboard" className="flex items-center gap-3 group">
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

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 font-semibold text-white">
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
              {/* underline animasi */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-400 transition-all duration-300 ${
                  location.pathname === item.link ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-yellow-600 to-red-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-yellow-400/40 transform hover:scale-105 transition duration-300"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
}

export default SiswaHeader;
