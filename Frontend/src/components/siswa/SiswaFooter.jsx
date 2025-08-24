import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function SiswaFooter() {
  return (
    <footer className="bg-red-900 text-white pt-12 pb-6 px-6 md:px-16">
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide">GoodTeacher</h2>
          <p className="text-sm text-gray-300 mt-3 leading-relaxed">
            Sistem Informasi Penilaian Kinerja Guru oleh Siswa. 
            Transparan, modern, dan profesional untuk meningkatkan kualitas pembelajaran.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/siswa/dashboard"
                className="flex items-center gap-2 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1"
              >
                ➜ Dashboard
              </a>
            </li>
            <li>
              <a
                href="/siswa/kuisioner"
                className="flex items-center gap-2 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1"
              >
                ➜ Kuisioner
              </a>
            </li>
            <li>
              <a
                href="/siswa/profil"
                className="flex items-center gap-2 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1"
              >
                ➜ Profil
              </a>
            </li>
            <li>
              <a
                href="/siswa/about"
                className="flex items-center gap-2 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1"
              >
                ➜ About
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-4">Kontak</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-cream-200 transition-colors duration-300">
              <FaEnvelope className="text-lg" /> support@goodteacher.com
            </li>
            <li className="flex items-center gap-3 hover:text-cream-200 transition-colors duration-300">
              <FaPhone className="text-lg" /> +62 812-3456-7890
            </li>
            <li className="flex items-center gap-3 hover:text-cream-200 transition-colors duration-300">
              <FaMapMarkerAlt className="text-lg" /> Jl. Pendidikan No. 123, Jakarta
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1 hover:scale-105"
              >
                <FaFacebook className="text-2xl" /> Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1 hover:scale-105"
              >
                <FaInstagram className="text-2xl" /> Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1 hover:scale-105"
              >
                <FaTwitter className="text-2xl" /> Twitter / X
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 hover:text-cream-200 transition-all duration-300 transform hover:translate-x-1 hover:scale-105"
              >
                <FaLinkedin className="text-2xl" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} GoodTeacher | Siswa Panel. All rights reserved.
      </div>
    </footer>
  );
}

export default SiswaFooter;