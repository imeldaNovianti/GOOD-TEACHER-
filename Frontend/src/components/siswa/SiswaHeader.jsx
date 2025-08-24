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

function SiswaHeader() {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <FaHome />, link: "/siswa/dashboard" },
    { name: "Isi Kuisioner", icon: <FaClipboardList />, link: "/siswa/kuisioner" },
    { name: "Hasil", icon: <FaChartPie />, link: "/siswa/hasil" },
    { name: "Profile", icon: <FaUser />, link: "/siswa/profile" },
    { name: "Achievement", icon: <FaMedal />, link: "/siswa/achievement" },
    { name: "About", icon: <FaInfoCircle />, link: "/siswa/about" },
  ];

  return (
    <header className="bg-red-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <Link to="/siswa/dashboard" className="flex items-center gap-2">
          <div className="bg-white text-red-800 font-extrabold text-lg px-3 py-1 rounded-lg shadow-md">
            GT
          </div>
          <h1 className="font-extrabold text-xl tracking-wide">
            GoodTeacher{" "}
            <span className="text-sm text-gray-300">| Siswa Panel</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 font-semibold">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`flex items-center gap-2 transition-all duration-300 ${
                location.pathname === item.link
                  ? "text-yellow-300 scale-110"
                  : "hover:text-yellow-200 hover:scale-105"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-white text-red-800 px-4 py-2 rounded-full font-semibold hover:bg-yellow-100 hover:scale-105 transition-all duration-300"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
}

export default SiswaHeader;
