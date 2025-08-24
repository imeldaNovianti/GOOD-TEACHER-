import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 👉 sementara pakai dummy user (nanti ganti ke backend API)
    if (username === "admin" && password === "123") {
      localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));
      navigate("/admin/dashboard");
    } else if (username === "siswa" && password === "123") {
      localStorage.setItem("user", JSON.stringify({ role: "SISWA" }));
      navigate("/siswa/dashboard");
    } else {
      alert("❌ Login gagal. Coba admin/123 atau siswa/123");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-cream-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-xl w-80 border border-gray-200"
      >
        <h1 className="text-xl font-bold mb-4 text-center text-red-800">
          Login GoodTeacher
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-red-400 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-red-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-red-700 text-white px-4 py-2 rounded w-full hover:bg-red-800 transition-colors duration-300">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
