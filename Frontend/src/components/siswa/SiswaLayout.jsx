import { Outlet } from "react-router-dom"; 
// Outlet = komponen React Router untuk render child route
import SiswaHeader from "./SiswaHeader"; 
// Import header siswa
import SiswaFooter from "./SiswaFooter"; 
// Import footer siswa

function SiswaLayout() { 
  // Layout utama untuk halaman siswa
  return (
    <div className="flex flex-col min-h-screen"> 
      {/* Flexbox kolom, tinggi minimal = layar penuh */}
      <SiswaHeader /> 
      {/* Header siswa di atas */}

      <main className="flex-grow bg-gray-100 p-6"> 
        {/* Konten utama, background abu-abu, padding */}
        <Outlet /> 
        {/* Tempat menampilkan konten dari route child */}
      </main>

      <SiswaFooter /> 
      {/* Footer siswa di bawah */}
    </div>
  );
}

export default SiswaLayout; 
// Export agar bisa digunakan di route utama
