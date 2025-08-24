import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminRoutes from "./AdminRoutes";
import SiswaRoutes from "./SiswaRoutes";
import { isLoggedIn, getUserRole } from "../utils/auth";

function AppRoutes() {
  const loggedIn = isLoggedIn();
  const role = getUserRole(); // "ADMIN" | "SISWA" | null

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes (nested) */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Siswa Routes (nested) */}
      <Route path="/siswa/*" element={<SiswaRoutes />} />

      {/* Default "/" redirect */}
      <Route
        path="/"
        element={
          loggedIn ? (
            role === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : role === "SISWA" ? (
              <Navigate to="/siswa/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-10 text-2xl font-bold text-red-600">
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
