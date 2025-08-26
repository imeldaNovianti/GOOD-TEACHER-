import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Logo from "../../assets/2-removebg-preview.png";

function SiswaFooter() {
  return (
    <footer className="relative text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-yellow-900"></div>

      {/* Particle Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Wave Animated Top */}
      <div className="absolute -top-1 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-24 animate-wave-slow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.44C187.53 76.55 85.87 98.51 0 
               120V0h1200v27.35c-92.34 19.42-196.16 
               31.91-313.39 39.09-177.05 10.9-330.13-1.36
               -565.22-10z"
            className="fill-red-800/50"
          ></path>
        </svg>
      </div>

      {/* Main Content Glass */}
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16 py-16 bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-3xl shadow-2xl z-10">
        
        {/* Brand Section */}
        <div className="flex flex-col items-start">
          <div className="bg-white/20 p-3 rounded-xl shadow-md backdrop-blur-md hover:scale-110 transition-transform duration-500 hover:shadow-yellow-400/50 hover:animate-pulse">
            <img src={Logo} alt="Logo" className="h-16 w-auto" />
          </div>
          <p className="text-sm text-gray-300 mt-4 leading-relaxed">
            Sistem Informasi Penilaian Kinerja Guru oleh Siswa. 
            Transparan, modern, dan profesional untuk meningkatkan kualitas pembelajaran.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-yellow-300">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Dashboard", path: "/siswa/dashboard" },
              { name: "Kuisioner", path: "/siswa/kuisioner" },
              { name: "Profil", path: "/siswa/profil" },
              { name: "About", path: "/siswa/about" },
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.path}
                  className="flex items-center gap-2 relative group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-transparent opacity-0 group-hover:opacity-40 transition duration-500 blur-lg"></span>
                  <span className="relative z-10 transition-all duration-300 group-hover:text-yellow-200 group-hover:translate-x-1 group-hover:scale-110">
                    ➜ {link.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-yellow-300">Kontak</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 hover:text-yellow-200 transition-colors duration-300">
              <FaEnvelope className="text-lg text-yellow-400 animate-pulse" /> support@goodteacher.com
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-200 transition-colors duration-300">
              <FaPhone className="text-lg text-yellow-400 animate-bounce" /> +62 812-3456-7890
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-200 transition-colors duration-300">
              <FaMapMarkerAlt className="text-lg text-yellow-400 animate-pulse" /> Jl. Pendidikan No. 123, Jakarta
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-yellow-300">Ikuti Kami</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Facebook", icon: <FaFacebook className="text-2xl" /> },
              { name: "Instagram", icon: <FaInstagram className="text-2xl" /> },
              { name: "Twitter / X", icon: <FaTwitter className="text-2xl" /> },
              { name: "LinkedIn", icon: <FaLinkedin className="text-2xl" /> },
            ].map((soc, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="flex items-center gap-3 relative group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-400 opacity-0 group-hover:opacity-30 transition duration-500 blur-lg"></span>
                  <span className="relative z-10 flex items-center gap-3 transition-all duration-300 group-hover:text-yellow-200 group-hover:scale-110 group-hover:translate-x-1">
                    {soc.icon} {soc.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400 animate-fade-in">
        © {new Date().getFullYear()} GoodTeacher | Siswa Panel. All rights reserved.
      </div>

      {/* Extra Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle infinite;
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-slow {
          animation: wave 8s linear infinite;
        }
      `}</style>
    </footer>
  );
}

export default SiswaFooter;
