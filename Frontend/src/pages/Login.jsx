import { useState } from "react";
import { FaUserAlt, FaLock, FaSchool } from "react-icons/fa";
import { motion } from "framer-motion";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Harap isi semua field.");
      return;
    }
    alert(`Login dengan email: ${form.email}`);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 px-4 overflow-hidden font-sans">
      {/* Background Educative Image */}
      <img
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
        alt="education"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Card Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white z-10"
      >
        {/* Logo */}
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
          {/* Email */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-400 transition">
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

          {/* Password */}
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-400 transition">
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

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 font-semibold"
          >
            Login
          </motion.button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Belum punya akun?{" "}
          <a
            href="#"
            className="text-red-300 hover:text-red-400 hover:underline transition"
          >
            Daftar disini
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
