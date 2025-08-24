import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

function AdminFooter() {
  return (
    <footer className="bg-red-900 text-white pt-12 pb-6 px-6 md:px-16">
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h3 className="text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-500">
            GoodTeacher
          </h3>
          <p className="text-sm text-gray-300 mt-3 leading-relaxed">
            Sistem Informasi Penilaian Kinerja Guru oleh Siswa.  
            Transparan, modern, dan profesional untuk mendukung pengelolaan data guru & siswa.
          </p>
        </div>

        {/* Info Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informasi</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Tentang Kami", link: "/admin/about" },
              { name: "Laporan Kuisioner", link: "/admin/laporan" },
              { name: "Data Guru", link: "/admin/dataguru" },
              { name: "Data Siswa", link: "/admin/datasiswa" },
            ].map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="inline-block hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
                >
                  ➜ {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-bold mb-4">Fitur Utama</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Dashboard Statistik Interaktif",
              "Filter & Pencarian Data",
              "Export PDF & Cetak Bukti",
              "Audit Trail Aktivitas",
            ].map((fitur, i) => (
              <li
                key={i}
                className="hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
              >
                {fitur}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Facebook", icon: <FaFacebook />, link: "#" },
              { name: "Instagram", icon: <FaInstagram />, link: "#" },
              { name: "Twitter / X", icon: <FaTwitter />, link: "#" },
              { name: "LinkedIn", icon: <FaLinkedin />, link: "#" },
            ].map((sosmed, i) => (
              <li key={i}>
                <a
                  href={sosmed.link}
                  className="flex items-center gap-3 hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-110"
                >
                  <span className="text-2xl">{sosmed.icon}</span> {sosmed.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-red-700 mt-10 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} GoodTeacher | Admin Panel. All rights reserved.
      </div>
    </footer>
  );
}

export default AdminFooter;
