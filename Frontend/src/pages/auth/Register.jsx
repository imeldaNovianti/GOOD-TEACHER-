import { useState } from "react";
import { register } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    namaLengkap: "",
    nisn: "",
    kelas: "",
    email: "",
    noHp: "",
    role: "SISWA",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 overflow-hidden">
      {/* Background animasi */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#dc2626,_transparent_50%),radial-gradient(circle_at_bottom_right,_#fde047,_transparent_50%)] animate-pulse opacity-40" />

      {/* Card Register */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white/10 backdrop-blur-xl border border-red-400/30 p-10 rounded-2xl shadow-2xl w-full max-w-4xl transform transition hover:scale-[1.02] hover:shadow-red-500/40"
      >
        {/* Ikon + Judul */}
        <div className="flex flex-col items-center mb-8">
          <FaUserPlus className="text-yellow-400 text-6xl mb-3 animate-bounce drop-shadow-[0_0_15px_#facc15]" />
          <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            Register Akun
          </h2>
        </div>

        {error && (
          <p className="text-red-400 mb-4 text-center font-semibold">{error}</p>
        )}

        {/* Form Grid */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Kiri */}
          <div className="space-y-4">
            <InputField
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <InputField
              type="text"
              name="namaLengkap"
              placeholder="Nama Lengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              required
            />
            <InputField
              type="text"
              name="nisn"
              placeholder="NISN"
              value={form.nisn}
              onChange={handleChange}
              required
            />
          </div>

          {/* Kanan */}
          <div className="space-y-4">
            <InputField
              type="text"
              name="kelas"
              placeholder="Kelas"
              value={form.kelas}
              onChange={handleChange}
              required
            />
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <InputField
              type="text"
              name="noHp"
              placeholder="No HP"
              value={form.noHp}
              onChange={handleChange}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all cursor-pointer"
            >
              <option value="SISWA">Siswa</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Tombol Submit */}
          <div className="col-span-1 md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px #facc15" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-yellow-400 text-white py-3 rounded-lg font-bold tracking-wide shadow-lg transition-all duration-300"
            >
              {loading ? "Mendaftarkan..." : "✨ Daftar Sekarang"}
            </motion.button>
          </div>
        </form>

        {/* Link Login */}
        <p className="text-sm text-center mt-6 text-gray-200">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// InputField Reusable dengan efek neon glow
function InputField({ type, name, placeholder, value, onChange, required }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all hover:shadow-[0_0_10px_#facc15] cursor-text"
    />
  );
}

export default Register;
