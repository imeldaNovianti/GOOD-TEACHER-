import { motion } from "framer-motion"; // import library framer-motion untuk animasi React
import Logo from "../../assets/2-removebg-preview.png"; // import file logo dari assets (ganti sesuai path di projectmu)
import { useEffect } from "react"; // import hook useEffect untuk side effect (inject CSS)

function AdminHeader() { // definisi komponen function bernama AdminHeader
  // inject CSS animasi langsung
  useEffect(() => { // hook useEffect dijalankan saat komponen pertama kali render
    const style = document.createElement("style"); // buat elemen <style> baru di dokumen
    style.innerHTML = ` // isi style dengan CSS khusus
      /* ✨ Efek shiny reflection untuk teks */
      .shiny-text {
        position: relative; // posisi relatif supaya ::before bisa diatur absolute
        color: #fff; // teks putih
        overflow: hidden; // sembunyikan bagian animasi yang keluar dari area teks
      }
      .shiny-text::before {
        content: ""; // pseudo-element kosong
        position: absolute; // posisinya absolute di atas teks
        top: 0; // mulai dari atas teks
        left: -75%; // posisi awal jauh ke kiri
        height: 100%; // tinggi penuh
        width: 50%; // lebar separuh teks
        background: linear-gradient( // gradient putih semi-transparan
          120deg,
          transparent,
          rgba(255, 255, 255, 0.8),
          transparent
        );
        transform: skewX(-20deg); // miringkan efek gradient
        animation: shine 3s infinite; // animasi jalan terus
      }
      @keyframes shine {
        0% { left: -75%; } // mulai gradient dari kiri
        100% { left: 125%; } // geser gradient sampai kanan keluar teks
      }

      /* ✨ Animasi background gradient */
      @keyframes gradientMove {
        0% { background-position: 0% 50%; } // mulai dari kiri
        50% { background-position: 100% 50%; } // geser ke kanan
        100% { background-position: 0% 50%; } // balik ke kiri
      }
      .animate-gradient {
        animation: gradientMove 10s ease infinite; // terapkan animasi looping pada background
      }
    `;
    document.head.appendChild(style); // tambahkan <style> ini ke <head> agar aktif
    return () => { document.head.removeChild(style); }; // cleanup: hapus style saat komponen unmount
  }, []); // dependensi kosong → hanya jalan sekali di mount/unmount

  return ( // mulai return JSX
    <header
      className="
        relative overflow-hidden
        bg-gradient-to-r from-red-900 via-red-700 to-red-800
        text-white px-6 py-6 shadow-2xl
        animate-gradient bg-[length:300%_300%]
      "
      // elemen header: posisi relatif, sembunyikan overflow, background gradient merah bergerak, teks putih, padding, shadow
    >
      {/* 🔹 Animated Aurora Background
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,100,0.4),transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,150,150,0.3),transparent_70%)] animate-pulse" />
      */}
      {/* bagian ini dikomentari, rencananya untuk efek aurora background dengan radial gradient */}

      {/* 🔹 Glassmorphism Layer */}
      <div className="relative flex justify-center items-center">
        {/* wrapper flex untuk logo dan judul, item dipusatkan */}

        <motion.div
          initial={{ opacity: 0, y: -30 }} // kondisi awal: transparan & agak ke atas
          animate={{ opacity: 1, y: 0 }}   // animasi masuk: muncul & posisi normal
          transition={{ duration: 0.9, ease: "easeOut" }} // durasi 0.9 detik, easing easeOut
          className="
            flex items-center gap-4 px-6 py-3 
            rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg
          "
          // container transparan dengan efek glassmorphism: blur, border tipis, shadow
        >
          {/* 🔹 Logo */}
          <motion.img
            src={Logo} // gambar logo
            alt="Logo" // teks alternatif
            className="h-16 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" 
            // logo dengan tinggi 16, lebar auto, ada drop shadow putih
            initial={{ rotate: -20, scale: 0.7, opacity: 0 }} 
            // animasi awal: miring -20°, kecil 0.7x, transparan
            animate={{ rotate: 0, scale: 1, opacity: 1 }} 
            // animasi akhir: normal lurus, ukuran 1x, terlihat
            transition={{ duration: 1, ease: "backOut" }} 
            // transisi 1 detik, easing backOut (elastis keluar)
          />

          {/* 🔹 Title dengan efek shiny reflection */}
          <motion.h1
            className="relative text-3xl font-extrabold tracking-widest shiny-text"
            // judul teks besar 3xl, tebal ekstra, jarak antar huruf lebar, dengan class shiny-text untuk efek refleksi
            initial={{ opacity: 0, x: 40 }} 
            // kondisi awal: transparan dan agak bergeser ke kanan
            animate={{ opacity: 1, x: 0 }} 
            // animasi masuk: muncul & ke posisi normal
            transition={{ delay: 0.4, duration: 0.8 }} 
            // animasi delay 0.4 detik agar muncul setelah logo
          >
            | Admin Panel {/* teks judul */}
          </motion.h1>
        </motion.div>
      </div>
    </header>
  );
}

export default AdminHeader; // export komponen agar bisa dipakai di file lain
