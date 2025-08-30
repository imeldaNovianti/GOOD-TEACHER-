import { useState } from "react"; // Mengimpor hook useState dari React untuk mengelola state
import { FaUserAlt, FaLock, FaSchool, FaEye, FaEyeSlash } from "react-icons/fa"; // Mengimpor ikon dari react-icons
import axios from "axios"; // Mengimpor axios untuk melakukan HTTP request
import { useNavigate } from "react-router-dom"; // Mengimpor useNavigate untuk navigasi halaman

function Login() {
  const [form, setForm] = useState({ email: "", password: "" }); // State untuk menyimpan input form
  const [errors, setErrors] = useState({}); // State untuk menyimpan error validation
  const [loading, setLoading] = useState(false); // State untuk menandakan apakah sedang loading (login)
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan atau menyembunyikan password
  const navigate = useNavigate(); // Hook untuk navigasi halaman setelah login

  // Fungsi untuk memvalidasi form
  const validate = (fieldValues = form) => {
    let temp = { ...errors };

    // Validasi Email
    if ("email" in fieldValues) {
      const email = fieldValues.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) temp.email = "Email wajib diisi"; // Jika email kosong
      else if (!emailRegex.test(email)) temp.email = "Format email tidak valid"; // Jika format email tidak valid
      else if (email.length > 32) temp.email = "Email maksimal 32 karakter"; // Jika email terlalu panjang
      else if (/\s/.test(email)) temp.email = "Email tidak boleh ada spasi"; // Jika email mengandung spasi
      else temp.email = ""; // Tidak ada error
    }

    // Validasi Password
    if ("password" in fieldValues) {
      const password = fieldValues.password;
      const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/\\|~`]+$/;
      if (!password) temp.password = "Password wajib diisi"; // Jika password kosong
      else if (password.length < 6) temp.password = "Password minimal 6 karakter"; // Jika password terlalu pendek
      else if (password.length > 20) temp.password = "Password maksimal 20 karakter"; // Jika password terlalu panjang
      else if (!passwordRegex.test(password)) temp.password = "Password mengandung karakter ilegal"; // Jika password mengandung karakter ilegal
      else if (/\s/.test(password)) temp.password = "Password tidak boleh ada spasi"; // Jika password mengandung spasi
      else temp.password = ""; // Tidak ada error
    }

    setErrors({ ...temp }); // Menyimpan error ke dalam state

    return Object.values(temp).every(x => x === ""); // Mengembalikan true jika tidak ada error
  };

  // Fungsi untuk menangani perubahan input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value }); // Mengupdate nilai input di state
    validate({ [name]: value }); // Memvalidasi nilai input yang baru
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman saat submit
    if (!validate()) return; // Jika form tidak valid, tidak lanjut ke login

    setLoading(true); // Set loading state ke true saat login sedang diproses
    try {
      // Mengirim request login ke backend
      const res = await axios.post("http://localhost:8080/api/users/login", form);

      if (!res.data || !res.data.role) {
        alert("❌ Login gagal: data user tidak valid"); // Jika data user tidak valid
        setLoading(false); // Set loading state ke false
        return;
      }

      alert(`✅ Login berhasil sebagai ${res.data.role}`); // Menampilkan pesan login berhasil
      localStorage.setItem("user", JSON.stringify(res.data)); // Menyimpan data user ke localStorage

      // Navigasi berdasarkan role user
      if (res.data.role.toLowerCase() === "siswa") {
        localStorage.setItem("siswaId", res.data.id); // Menyimpan id siswa jika role siswa
        navigate("/siswa/kuisioner"); // Navigasi ke halaman kuisioner siswa
      } else if (res.data.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard"); // Navigasi ke halaman dashboard admin
      } else {
        navigate("/"); // Navigasi ke halaman utama
      }
    } catch (err) {
      console.error(err); // Log error
      alert("❌ Login gagal: " + (err.response?.data || err.message)); // Menampilkan pesan error jika login gagal
    } finally {
      setLoading(false); // Set loading ke false setelah request selesai
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-yellow-900"></div>
      <div className="absolute w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-ping bottom-20 right-10"></div>
      <div className="absolute w-80 h-80 bg-red-700/10 rounded-full blur-2xl animate-pulse top-1/2 left-1/2 -translate-x-1/2"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-yellow-400/30 rounded-2xl shadow-2xl p-10 text-white transform transition duration-500 hover:scale-[1.03] hover:shadow-yellow-400/50">
        <div className="flex flex-col items-center mb-8">
          <FaSchool className="text-6xl text-yellow-400 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] mb-4" />
          <h2 className="text-3xl font-bold text-center tracking-wide">Selamat Datang 👋</h2>
          <p className="text-center text-sm text-gray-200 mt-2">
            Silakan login ke <span className="font-semibold text-yellow-400">GoodTeacher</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<FaUserAlt className="text-yellow-400/80" />}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            icon={<FaLock className="text-yellow-400/80" />}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            toggleShow={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />

          <button
            type="submit"
            disabled={!form.email || !form.password || Object.values(errors).some(x => x)}
            className={`w-full bg-gradient-to-r from-red-600 via-yellow-600 to-red-700 text-white py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Sedang Login..." : "Login"}
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

// InputField Component untuk input form yang bisa digunakan untuk email dan password
function InputField({ icon, type, name, placeholder, value, onChange, error, toggleShow, showPassword }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center bg-white/10 border border-yellow-400/30 rounded-lg px-4 py-3 transition-all duration-300 hover:shadow-md hover:shadow-yellow-400/30 focus-within:ring-2 focus-within:ring-yellow-400">
        {icon && <div className="mr-3">{icon}</div>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white placeholder-white/50"
        />
        {toggleShow && (
          <div onClick={toggleShow} className="cursor-pointer text-yellow-400 ml-2">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>
      {error && <span className="text-red-400 text-sm mt-1 ml-1">{error}</span>}
    </div>
  );
}

export default Login;
