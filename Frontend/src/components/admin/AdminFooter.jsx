import {               // import beberapa icon sosial media dari react-icons
  FaFacebook,          // icon Facebook
  FaInstagram,         // icon Instagram
  FaTwitter,           // icon Twitter / X
  FaLinkedin,          // icon LinkedIn
} from "react-icons/fa";
import Logo from "../../assets/2-removebg-preview.png"; // import logo PNG untuk brand

function AdminFooter() { // definisi komponen fungsi bernama AdminFooter
  return (              // return JSX untuk menampilkan footer
    <footer className="bg-red-900 text-white pt-12 pb-6 px-6 md:px-16"> 
      {/* elemen footer dengan background merah tua, teks putih, padding atas bawah & kiri kanan */}

      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* container grid dengan max width, auto margin center, default 1 kolom, di md menjadi 4 kolom, ada gap antar kolom */}

        {/* Brand Section */}
        <div className="flex flex-col items-start">
          {/* section brand/logo dengan flex arah kolom, item rata kiri */}

          {/* Logo PNG */}
          <img src={Logo} alt="Logo" className="h-22 w-auto mb-2" />
          {/* tampilkan gambar logo dengan tinggi 22, lebar auto, margin bawah 2 */}

          <p className="text-sm text-gray-300 mt-1 leading-relaxed">
            {/* deskripsi singkat sistem dengan font kecil, abu-abu terang, margin atas kecil, spasi antar baris nyaman */}
            Sistem Informasi Penilaian Kinerja Guru oleh Siswa.  
            Transparan, modern, dan profesional untuk mendukung pengelolaan data guru & siswa.
          </p>
        </div>

        {/* Info Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Informasi</h3>
          {/* judul section informasi dengan font besar, tebal, margin bawah */}

          <ul className="space-y-2 text-sm">
            {/* daftar link informasi dengan spasi antar item 2, font kecil */}

            {[
              { name: "Tentang Kami", link: "/admin/about" },      // link tentang kami
              { name: "Laporan Kuisioner", link: "/admin/laporan" }, // link laporan
              { name: "Data Guru", link: "/admin/dataguru" },     // link data guru
              { name: "Data Siswa", link: "/admin/datasiswa" },   // link data siswa
            ].map((item, i) => ( // map array ke elemen <li>
              <li key={i}> {/* setiap item list diberi key unik berdasarkan index */}
                <a
                  href={item.link} // arahkan ke link sesuai objek
                  className="inline-block hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
                  // styling link: inline-block, hover jadi kuning, transisi halus, bergeser & sedikit membesar saat hover
                >
                  ➜ {item.name} {/* tampilkan nama link dengan tanda panah */}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-bold mb-4">Fitur Utama</h3>
          {/* judul section fitur utama */}

          <ul className="space-y-2 text-sm">
            {/* list fitur utama dengan spasi antar item */}

            {[
              "Dashboard Statistik Interaktif", // fitur dashboard
              "Filter & Pencarian Data",        // fitur filter/pencarian
              "Export PDF & Cetak Bukti",       // fitur export cetak
              "Audit Trail Aktivitas",          // fitur audit trail
            ].map((fitur, i) => ( // map array string fitur ke elemen list
              <li
                key={i} // key list pakai index
                className="hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
                // styling tiap fitur agar animasi hover berubah warna & bergeser
              >
                {fitur} {/* tampilkan teks fitur */}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
          {/* judul section sosial media */}

          <ul className="space-y-3 text-sm">
            {/* list sosial media dengan spasi antar item */}

            {[
              { name: "Facebook", icon: <FaFacebook />, link: "#" },   // item facebook dengan icon
              { name: "Instagram", icon: <FaInstagram />, link: "#" }, // item instagram dengan icon
              { name: "Twitter / X", icon: <FaTwitter />, link: "#" }, // item twitter
              { name: "LinkedIn", icon: <FaLinkedin />, link: "#" },   // item linkedin
            ].map((sosmed, i) => ( // mapping array sosial media
              <li key={i}>
                <a
                  href={sosmed.link} // arahkan ke link sosmed
                  className="flex items-center gap-3 hover:text-yellow-300 transition-all duration-300 transform hover:translate-x-2 hover:scale-110"
                  // styling: flex horizontal, jarak antar icon & teks 3, hover efek warna & animasi geser+zoom
                >
                  <span className="text-2xl">{sosmed.icon}</span> {/* tampilkan icon dengan ukuran besar */}
                  {sosmed.name} {/* tampilkan nama sosmed */}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-red-700 mt-10 pt-4 text-center text-sm text-gray-300">
        {/* bagian bawah footer: garis atas, margin atas 10, padding atas 4, teks kecil abu-abu terang, rata tengah */}
        © {new Date().getFullYear()} GoodTeacher | Admin Panel. All rights reserved.
        {/* tampilkan copyright dinamis sesuai tahun sekarang */}
      </div>
    </footer>
  );
}

export default AdminFooter; // export default agar bisa digunakan di file lain
