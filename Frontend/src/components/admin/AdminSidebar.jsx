import { useState } from "react"; // import useState dari React untuk mengatur state (sidebar open/close)
import { Link, useLocation, useNavigate } from "react-router-dom"; // import Link (navigasi antar halaman), useLocation (cek route aktif), useNavigate (navigasi manual)
import { motion } from "framer-motion"; // import framer-motion untuk animasi smooth
import { // import semua icon dari react-icons/fa
  FaTachometerAlt, // icon Dashboard
  FaChalkboardTeacher, // icon Data Guru
  FaUsers, // icon Data Siswa
  FaQuestionCircle, // icon Pertanyaan
  FaCalendarAlt, // icon Periode
  FaClipboardList, // icon Kuisioner & Feedback
  FaFileAlt, // icon Laporan
  FaInfoCircle, // icon About
  FaSignOutAlt, // icon Logout
  FaBars, // icon toggle sidebar
} from "react-icons/fa";

function AdminSidebar() { // definisi komponen function AdminSidebar
  const [open, setOpen] = useState(true); // state untuk cek sidebar terbuka (true) atau collapsed (false)
  const navigate = useNavigate(); // hook untuk pindah halaman secara programatik
  const location = useLocation(); // hook untuk mendapatkan path aktif (cek menu aktif)

  const handleLogout = () => { // fungsi logout
    localStorage.removeItem("user"); // hapus data user dari localStorage
    navigate("/login"); // redirect ke halaman login
  };

  // daftar menu sidebar
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, link: "/admin/dashboard" }, // menu Dashboard
    { name: "Data Guru", icon: <FaChalkboardTeacher />, link: "/admin/dataguru" }, // menu Data Guru
    { name: "Data Siswa", icon: <FaUsers />, link: "/admin/datasiswa" }, // menu Data Siswa
    { name: "Pertanyaan", icon: <FaQuestionCircle />, link: "/admin/pertanyaan" }, // menu Pertanyaan
    { name: "Periode", icon: <FaCalendarAlt />, link: "/admin/periode" }, // menu Periode
    { name: "Kuisioner", icon: <FaClipboardList />, link: "/admin/kuisioner" }, // menu Kuisioner
    { name: "Laporan", icon: <FaFileAlt />, link: "/admin/laporan" }, // menu Laporan
    { name: "Feedback", icon: <FaClipboardList />, link: "/admin/feedback" }, // menu Feedback
    { name: "About", icon: <FaInfoCircle />, link: "/admin/about" }, // menu About
    { name: "Logout", icon: <FaSignOutAlt />, action: "logout" }, // menu Logout → tidak punya link tapi action
  ];

  return ( // mulai return JSX
    <motion.aside
      animate={{ width: open ? 250 : 80 }} // animasi: jika open true → lebar 250px, kalau false → 80px
      className="bg-red-800 text-white min-h-screen flex flex-col shadow-2xl relative" 
      // styling: sidebar background merah, teks putih, tinggi penuh, flex column, shadow tebal
    >
      {/* 🔹 Toggle Button */}
      <div className="flex justify-end p-4"> 
        {/* container tombol toggle, rata kanan */}
        <button
          onClick={() => setOpen(!open)} // toggle state open saat diklik
          className="text-white text-xl focus:outline-none hover:scale-110 transition" 
          // tombol warna putih, ukuran xl, tanpa outline, ada animasi scaling saat hover
        >
          <FaBars /> {/* icon toggle */}
        </button>
      </div>

      {/* 🔹 Navigation Menu */}
      <nav className="flex flex-col flex-1 mt-2 gap-2 px-2"> 
        {/* navigasi menu, flex column, isi penuh (flex-1), ada gap antar item */}
        {menuItems.map((item, i) => { // looping semua menu dari menuItems
          const isActive = location.pathname === item.link; 
          // cek apakah route aktif sama dengan link menu

          const handleClick = () => { // handle klik item menu
            if (item.action === "logout") { // jika item adalah logout
              handleLogout(); // panggil fungsi logout
            }
          };

          return item.action === "logout" ? ( // cek apakah menu adalah logout
            // 🔹 Logout button
            <button
              key={i} // key unik untuk setiap item
              onClick={handleClick} // saat klik jalankan handleClick (logout)
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-md w-full text-left
                transition-all duration-300
                hover:scale-105 hover:bg-red-700
              `}
              // styling tombol logout: full width, text kiri, hover animasi scaling & bg merah lebih gelap
            >
              {item.icon} {/* icon logout */}
              {open && <span>{item.name}</span>} {/* tampilkan teks jika sidebar open */}
            </button>
          ) : (
            // 🔹 Menu biasa
            <Link
              key={i} // key unik
              to={item.link} // arahkan ke link
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-md
                transition-all duration-300
                hover:scale-105
                ${isActive 
                  ? "bg-red-900 text-white font-bold shadow-md" 
                  : "hover:bg-red-700"}
              `}
              // styling menu: flex row, ada gap icon & teks, rounded, hover animasi
              // jika aktif → bg lebih gelap + bold + shadow
            >
              {item.icon} {/* icon menu */}
              {open && <span>{item.name}</span>} {/* teks nama menu hanya muncul kalau sidebar open */}

              {/* Underline animasi untuk menu aktif */}
              {isActive && ( // jika menu aktif
                <motion.span
                  layoutId="underline" // layoutId untuk shared layout animation
                  className="absolute left-0 bottom-0 h-1 rounded-full bg-red-500 w-full" 
                  // garis bawah menu aktif: posisi absolute di bawah, tebal 1, bg merah
                  transition={{ type: "spring", stiffness: 500, damping: 30 }} 
                  // animasi spring → fleksibel dengan kecepatan dan elastisitas
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}

export default AdminSidebar; // export komponen agar bisa digunakan di file lain
