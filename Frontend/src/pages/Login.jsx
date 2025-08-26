import { useState } from "react";
import { FaUserAlt, FaLock, FaSchool } from "react-icons/fa";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) {
      alert("Harap isi semua field.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", form);
      alert(`✅ Login berhasil sebagai ${res.data.role}`);
      
      if (res.data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/siswa/dashboard";
      }
    } catch (err) {
      alert("❌ Login gagal: " + err.response?.data);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 px-4 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white z-10"
      >
        <div className="flex justify-center items-center mb-6">
          <FaSchool className="text-5xl text-red-300 animate-bounce drop-shadow-lg" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-3 tracking-wide">
          Selamat Datang 👋
        </h2>
        <p className="text-center text-sm text-gray-200 mb-8">
          Silakan login untuk mengakses sistem{" "}
          <span className="font-semibold text-red-300">GoodTeacher</span>.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
            <FaUserAlt className="text-white/70 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-white/50"
              required
            />
          </div>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3">
            <FaLock className="text-white/70 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-white placeholder-white/50"
              required
            />
          </div>

          {/* Pilihan Role */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "admin" })}
              className={`px-4 py-2 rounded-lg ${
                form.role === "admin"
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-gray-300"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "siswa" })}
              className={`px-4 py-2 rounded-lg ${
                form.role === "siswa"
                  ? "bg-red-500 text-white"
                  : "bg-white/20 text-gray-300"
              }`}
            >
              Siswa
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 font-semibold"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
