import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaQuestionCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";

function AdminSidebar() {
  return (
    <aside className="bg-red-900 text-white w-64 min-h-screen p-6 shadow-lg flex flex-col">
      
      {/* Logo */}
      {/* <div className="flex items-center gap-3 mb-8">
        <div className="bg-white text-red-900 font-extrabold text-xl px-3 py-2 rounded-lg shadow-md transform hover:scale-110 transition duration-300">
          GT
        </div>
        <h1 className="text-2xl font-extrabold tracking-wide">Admin Panel</h1>
      </div> */}

      {/* Navigation */}
      <nav className="flex flex-col space-y-3 font-semibold">
        {[
          { name: "Dashboard", icon: <FaTachometerAlt />, link: "/admin/dashboard" },
          { name: "Data Guru", icon: <FaChalkboardTeacher />, link: "/admin/dataguru" },
          { name: "Data Siswa", icon: <FaUsers />, link: "/admin/datasiswa" },
          { name: "Pertanyaan", icon: <FaQuestionCircle />, link: "/admin/pertanyaan" },
          { name: "Periode", icon: <FaCalendarAlt />, link: "/admin/periode" },
          { name: "Kuisioner", icon: <FaClipboardList />, link: "/admin/kuisioner" },
          { name: "Laporan", icon: <FaFileAlt />, link: "/admin/laporan" },
          { name: "About", icon: <FaInfoCircle />, link: "/admin/about" },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-300"
          >
            {item.icon} <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Info di Sidebar */}
      {/* <div className="mt-auto pt-6 border-t border-red-700 text-sm text-gray-300">
        © {new Date().getFullYear()} GoodTeacher
      </div> */}
    </aside>
  );
}

export default AdminSidebar;
