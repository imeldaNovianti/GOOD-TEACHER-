import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SiswaHeader from "./components/siswa/SiswaHeader";

function App() {
  const location = useLocation();

  // Daftar route yang pakai header siswa
  const showSiswaHeader = location.pathname.startsWith("/siswa");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header siswa hanya tampil di route siswa */}
      {showSiswaHeader && <SiswaHeader />}

      {/* Main wrapper dengan padding-top hanya jika header tampil */}
      <main className={showSiswaHeader ? "pt-[80px]" : ""}>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
