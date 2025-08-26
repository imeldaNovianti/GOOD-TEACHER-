import { useState } from "react";
import { FaUserAlt, FaLock, FaSchool } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Harap isi semua field.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", form);

      if (!res.data || !res.data.role) {
        alert("❌ Login gagal: data user tidak valid");
        return;
      }

      alert(`✅ Login berhasil sebagai ${res.data.role}`);
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role.toLowerCase() === "siswa") {
        localStorage.setItem("siswaId", res.data.id);
        navigate("/siswa/kuisioner");
      } else if (res.data.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Login gagal: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden font-sans">
      {/* Background gradient mewah */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-yellow-900"></div>

      {/* Glow orbs */}
      <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-ping bottom-20 right-10"></div>
      <div className="absolute w-80 h-80 bg-red-700/10 rounded-full blur-2xl animate-pulse top-1/2 left-1/2 -translate-x-1/2"></div>

      {/* Card Glass */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-yellow-400/30 rounded-2xl shadow-2xl p-10 text-white transform transition duration-500 hover:scale-[1.03] hover:shadow-yellow-400/50">
        
        {/* Ikon & Title */}
        <div className="flex flex-col items-center mb-8">
          <FaSchool className="text-6xl text-yellow-400 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] mb-4" />
          <h2 className="text-3xl font-bold text-center tracking-wide">
            Selamat Datang 👋
          </h2>
          <p className="text-center text-sm text-gray-200 mt-2">
            Silakan login ke{" "}
            <span className="font-semibold text-yellow-400">GoodTeacher</span>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            icon={<FaUserAlt className="text-yellow-400/80" />}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            icon={<FaLock className="text-yellow-400/80" />}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-yellow-600 to-red-700 hover:from-yellow-600 hover:to-red-800 text-white py-3 rounded-lg shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-200">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition"
          >
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}

// Reusable Input Field
function InputField({ icon, type, name, placeholder, value, onChange }) {
  return (
    <div className="flex items-center bg-white/10 border border-yellow-400/30 rounded-lg px-4 py-3 transition-all duration-300 hover:shadow-md hover:shadow-yellow-400/30 focus-within:ring-2 focus-within:ring-yellow-400">
      {icon && <div className="mr-3">{icon}</div>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-white placeholder-white/50"
        required
      />
    </div>
  );
}

export default Login;
