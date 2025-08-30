import { Navigate } from "react-router-dom"; 
// import Navigate untuk redirect halaman
import { getUser } from "../../utils/auth"; 
// import fungsi getUser untuk ambil user dari auth

function ProtectedRoute({ children, role }) {
  // Komponen wrapper untuk proteksi route
  // children = halaman yang ingin dilindungi
  // role = role khusus yang diperbolehkan (opsional)

  const user = getUser(); // ambil data user dari localStorage/auth utils

  if (!user) return <Navigate to="/login" />; 
  // jika user belum login, arahkan ke halaman login

  if (role && user.role !== role) return <Navigate to="/" />; 
  // jika role diberikan dan user tidak sesuai role -> redirect ke halaman utama

  return children; // jika lolos semua syarat, tampilkan halaman
}

export default ProtectedRoute; // export komponen agar bisa dipakai di route
