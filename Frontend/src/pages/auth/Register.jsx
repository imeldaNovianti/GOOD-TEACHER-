import { useState } from "react";
import { register } from "../../api/authApi"; // pastikan authApi ada fungsi register
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    namaLengkap: "",
    email: "",
    noHp: "",
    role: "SISWA", // default siswa
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
      await register(form); // panggil API register
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login"); // redirect ke login
    } catch (err) {
      console.error(err);
      setError("Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-red-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-900 mb-6">Register</h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="namaLengkap"
            placeholder="Nama Lengkap"
            value={form.namaLengkap}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="noHp"
            placeholder="No HP"
            value={form.noHp}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="SISWA">Siswa</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-2 rounded hover:bg-red-700 transition"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-red-700 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
