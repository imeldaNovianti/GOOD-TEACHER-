import { motion } from "framer-motion";
import Logo from "../../assets/2-removebg-preview.png"; // ganti path sesuai projekmu
import { useEffect } from "react";

function AdminHeader() {
  // inject CSS animasi langsung
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* ✨ Efek shiny reflection untuk teks */
      .shiny-text {
        position: relative;
        color: #fff;
        overflow: hidden;
      }
      .shiny-text::before {
        content: "";
        position: absolute;
        top: 0;
        left: -75%;
        height: 100%;
        width: 50%;
        background: linear-gradient(
          120deg,
          transparent,
          rgba(255, 255, 255, 0.8),
          transparent
        );
        transform: skewX(-20deg);
        animation: shine 3s infinite;
      }
      @keyframes shine {
        0% { left: -75%; }
        100% { left: 125%; }
      }

      /* ✨ Animasi background gradient */
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient {
        animation: gradientMove 10s ease infinite;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <header
      className="
        relative overflow-hidden
        bg-gradient-to-r from-red-900 via-red-700 to-red-800
        text-white px-6 py-6 shadow-2xl
        animate-gradient bg-[length:300%_300%]
      "
    >
      {/* 🔹 Animated Aurora Background
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,100,0.4),transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,150,150,0.3),transparent_70%)] animate-pulse" />
 */}
      {/* 🔹 Glassmorphism Layer */}
      <div className="relative flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="
            flex items-center gap-4 px-6 py-3 
            rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg
          "
        >
          {/* 🔹 Logo */}
          <motion.img
            src={Logo}
            alt="Logo"
            className="h-16 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            initial={{ rotate: -20, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          />

          {/* 🔹 Title dengan efek shiny reflection */}
          <motion.h1
            className="relative text-3xl font-extrabold tracking-widest shiny-text"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            | Admin Panel
          </motion.h1>
        </motion.div>
      </div>
    </header>
  );
}

export default AdminHeader;
