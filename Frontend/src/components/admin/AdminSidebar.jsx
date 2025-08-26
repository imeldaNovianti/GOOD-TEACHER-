import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaQuestionCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaFileAlt,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, link: "/admin/dashboard" },
    { name: "Data Guru", icon: <FaChalkboardTeacher />, link: "/admin/dataguru" },
    { name: "Data Siswa", icon: <FaUsers />, link: "/admin/datasiswa" },
    { name: "Pertanyaan", icon: <FaQuestionCircle />, link: "/admin/pertanyaan" },
    { name: "Periode", icon: <FaCalendarAlt />, link: "/admin/periode" },
    { name: "Kuisioner", icon: <FaClipboardList />, link: "/admin/kuisioner" },
    { name: "Laporan", icon: <FaFileAlt />, link: "/admin/laporan" },
    { name: "About", icon: <FaInfoCircle />, link: "/admin/about" },
    { name: "Logout", icon: <FaSignOutAlt />, action: "logout" }, // 🔹 Tambahkan logout di list
  ];

  return (
    <motion.aside
      animate={{ width: open ? 250 : 80 }}
      className="bg-gradient-to-b from-red-900 via-red-600 to-pink-700 text-white min-h-screen flex flex-col shadow-2xl relative"
    >
      {/* 🔹 Toggle Button (di paling atas) */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setOpen(!open)}
          className="text-white text-xl focus:outline-none hover:scale-110 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* 🔹 Navigation Menu */}
      <nav className="flex flex-col flex-1 mt-2 gap-2 px-2">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.link;

          const handleClick = () => {
            if (item.action === "logout") {
              handleLogout();
            }
          };

          return item.action === "logout" ? (
            // 🔹 Logout button
            <button
              key={i}
              onClick={handleClick}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-md w-full text-left
                transition-all duration-300
                hover:scale-105 hover:bg-red-700/70 hover:shadow-lg
              `}
            >
              {item.icon}
              {open && <span>{item.name}</span>}
            </button>
          ) : (
            // 🔹 Menu biasa
            <Link
              key={i}
              to={item.link}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-md
                transition-all duration-300
                hover:scale-105
                ${isActive 
                  ? "bg-gradient-to-r from-red-500 via-red-700 to-red-500 text-white font-bold shadow-md" 
                  : "hover:bg-red-700/70 hover:shadow-lg"}
              `}
            >
              {item.icon}
              {open && <span>{item.name}</span>}

              {/* Underline animasi untuk menu aktif */}
              {isActive && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-1 rounded-full bg-red-900 w-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}

export default AdminSidebar;
