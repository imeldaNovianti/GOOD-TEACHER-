import { useState, useEffect } from "react"; 
import { register } from "../../api/authApi"; 
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaExclamationCircle } from "react-icons/fa"; // Mengimpor ikon dari react-icons
import { motion } from "framer-motion"; // Mengimpor komponen animasi dari framer-motion

function Register() { // Deklarasi komponen Register
  const navigate = useNavigate(); // Inisialisasi fungsi navigate untuk perubahan rute

  // State untuk menyimpan data form
  const [form, setForm] = useState({
    username: "", // Field username
    password: "", // Field password
    namaLengkap: "", // Field nama lengkap
    nisn: "", // Field NISN
    kelas: "", // Field kelas
    email: "", // Field email
    noHp: "", // Field nomor HP
    role: "SISWA", // Field role dengan default value SISWA
  });

  // State untuk menyimpan pesan error validasi
  const [errors, setErrors] = useState({
    username: "", // Error username
    password: "", // Error password
    namaLengkap: "", // Error nama lengkap
    nisn: "", // Error NISN
    kelas: "", // Error kelas
    email: "", // Error email
    noHp: "", // Error nomor HP
  });

  // State untuk menandai field yang sudah disentuh/difokuskan
  const [touched, setTouched] = useState({
    username: false, // Status sentuh username
    password: false, // Status sentuh password
    namaLengkap: false, // Status sentuh nama lengkap
    nisn: false, // Status sentuh NISN
    kelas: false, // Status sentuh kelas
    email: false, // Status sentuh email
    noHp: false, // Status sentuh nomor HP
  });

  const [error, setError] = useState(""); // State untuk error umum/global
  const [loading, setLoading] = useState(false); // State untuk status loading

  // Aturan validasi untuk setiap field
  const validationRules = {
    username: { // Aturan validasi username
      required: true, // Wajib diisi
      minLength: 3, // Panjang minimal 3 karakter
      maxLength: 20, // Panjang maksimal 20 karakter
      pattern: /^[a-zA-Z0-9_]+$/, // Pola karakter yang diizinkan
      message: "Username harus 3-20 karakter, hanya huruf, angka, dan underscore" // Pesan error
    },
    password: { // Aturan validasi password
      required: true, // Wajib diisi
      minLength: 6, // Panjang minimal 6 karakter
      message: "Password minimal 6 karakter" // Pesan error
    },
    namaLengkap: { // Aturan validasi nama lengkap
      required: true, // Wajib diisi
      minLength: 3, // Panjang minimal 3 karakter
      maxLength: 50, // Panjang maksimal 50 karakter
      message: "Nama lengkap harus 3-50 karakter" // Pesan error
    },
    nisn: { // Aturan validasi NISN
      required: true, // Wajib diisi
      pattern: /^[0-9]+$/, // Hanya angka yang diizinkan
      minLength: 5, // Panjang minimal 5 digit
      maxLength: 20, // Panjang maksimal 20 digit
      message: "NISN harus angka, 5-20 digit" // Pesan error
    },
    kelas: { // Aturan validasi kelas
      required: true, // Wajib diisi
      minLength: 1, // Panjang minimal 1 karakter
      maxLength: 10, // Panjang maksimal 10 karakter
      message: "Kelas harus 1-10 karakter" // Pesan error
    },
    email: { // Aturan validasi email
      required: false, // Tidak wajib diisi
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Pola format email
      message: "Format email tidak valid" // Pesan error
    },
    noHp: { // Aturan validasi nomor HP
      required: false, // Tidak wajib diisi
      pattern: /^[0-9+-\s]+$/, // Pola karakter yang diizinkan
      minLength: 10, // Panjang minimal 10 digit
      maxLength: 15, // Panjang maksimal 15 digit
      message: "Format nomor HP tidak valid (10-15 digit)" // Pesan error
    }
  };

  // Fungsi untuk memvalidasi field
  const validateField = (name, value) => {
    const rules = validationRules[name]; // Mengambil aturan validasi berdasarkan nama field
    if (!rules) return ""; // Jika tidak ada aturan, kembalikan string kosong
    
    if (rules.required && !value.trim()) { // Jika wajib diisi dan kosong
      return "Field ini wajib diisi"; // Kembalikan pesan error
    }
    
    if (value && rules.minLength && value.length < rules.minLength) { // Jika panjang kurang dari minimal
      return `Minimal ${rules.minLength} karakter`; // Kembalikan pesan error
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) { // Jika panjang lebih dari maksimal
      return `Maksimal ${rules.maxLength} karakter`; // Kembalikan pesan error
    }
    
    if (value && rules.pattern && !rules.pattern.test(value)) { // Jika tidak sesuai pola
      return rules.message; // Kembalikan pesan error
    }
    
    return ""; // Jika valid, kembalikan string kosong
  };

  // Fungsi untuk memvalidasi seluruh form
  const validateForm = () => {
    const newErrors = {}; // Objek untuk menyimpan error baru
    Object.keys(form).forEach(key => { // Iterasi setiap key dalam form
      if (key !== 'role') { // Skip field role
        newErrors[key] = validateField(key, form[key]); // Validasi field dan simpan hasilnya
      }
    });
    setErrors(newErrors); // Set state errors dengan error baru
    
    // Cek jika ada error, kembalikan false jika ada error
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Handler perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target; // Ambil nama dan nilai dari input
    setForm({ ...form, [name]: value }); // Update state form dengan nilai baru
    
    // Validasi real-time jika field sudah pernah disentuh
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) }); // Update error untuk field tersebut
    }
  };

  // Handler ketika field kehilangan fokus
  const handleBlur = (e) => {
    const { name } = e.target; // Ambil nama field
    setTouched({ ...touched, [name]: true }); // Tandai field sebagai tersentuh
    setErrors({ ...errors, [name]: validateField(name, form[name]) }); // Validasi field dan update error
  };

  // Handler submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah perilaku default form
    
    // Tandai semua field sebagai tersentuh
    const allTouched = {};
    Object.keys(touched).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validasi form
    const isValid = validateForm(); // Jalankan validasi form
    if (!isValid) { // Jika tidak valid
      setError("Terdapat kesalahan dalam pengisian form"); // Set error umum
      return; // Hentikan proses
    }
    
    setLoading(true); // Set status loading menjadi true
    setError(""); // Reset error umum

    try {
      await register(form); // Panggil API register dengan data form
      alert("Registrasi berhasil! Silakan login."); // Tampilkan alert sukses
      navigate("/login"); // Arahkan ke halaman login
    } catch (err) { // Jika terjadi error
      console.error(err); // Log error ke console
      setError("Registrasi gagal. Coba lagi."); // Set error umum
    } finally {
      setLoading(false); // Set status loading menjadi false
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 overflow-hidden">
      {/* Background animasi */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#dc2626,_transparent_50%),radial-gradient(circle_at_bottom_right,_#fde047,_transparent_50%)] animate-pulse opacity-40" />

      {/* Card Register */}
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }} // Animasi awal: opacity 0, posisi Y 80px, skala 0.9
        animate={{ opacity: 1, y: 0, scale: 1 }} // Animasi akhir: opacity 1, posisi Y 0, skala 1
        transition={{ duration: 0.8, ease: "easeOut" }} // Transisi: durasi 0.8 detik dengan easing easeOut
        className="relative bg-white/10 backdrop-blur-xl border border-red-400/30 p-10 rounded-2xl shadow-2xl w-full max-w-4xl transform transition hover:scale-[1.02] hover:shadow-red-500/40"
      >
        {/* Ikon + Judul */}
        <div className="flex flex-col items-center mb-8">
          <FaUserPlus className="text-yellow-400 text-6xl mb-3 animate-bounce drop-shadow-[0_0_15px_#facc15]" />
          <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            Register Akun
          </h2>
        </div>

        {error && ( // Jika ada error umum, tampilkan
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-center">
            <FaExclamationCircle className="text-red-400 mr-2" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Form Grid */}
        <form
          onSubmit={handleSubmit} // Handler submit form
          className="grid grid-cols-1 md:grid-cols-2 gap-6" // Grid layout responsive
        >
          {/* Kiri */}
          <div className="space-y-4">
            <InputField
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              touched={touched.username}
              required
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              required
            />
            <InputField
              type="text"
              name="namaLengkap"
              placeholder="Nama Lengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.namaLengkap}
              touched={touched.namaLengkap}
              required
            />
            <InputField
              type="text"
              name="nisn"
              placeholder="NISN"
              value={form.nisn}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nisn}
              touched={touched.nisn}
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
              onBlur={handleBlur}
              error={errors.kelas}
              touched={touched.kelas}
              required
            />
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />
            <InputField
              type="text"
              name="noHp"
              placeholder="No HP"
              value={form.noHp}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.noHp}
              touched={touched.noHp}
            />
            <div>
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
          </div>

          {/* Tombol Submit */}
          <div className="col-span-1 md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px #facc15" }} // Animasi saat hover
              whileTap={{ scale: 0.95 }} // Animasi saat ditekan
              type="submit"
              disabled={loading} // Nonaktifkan tombol saat loading
              className="w-full bg-gradient-to-r from-red-600 to-yellow-400 text-white py-3 rounded-lg font-bold tracking-wide shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mendaftarkan..." : "✨ Daftar Sekarang"} // Tampilkan teks sesuai status loading
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

// Komponen InputField yang dapat digunakan kembali
function InputField({ type, name, placeholder, value, onChange, onBlur, error, touched, required }) {
  return (
    <div>
      <input
        type={type} // Tipe input
        name={name} // Nama input
        placeholder={placeholder} // Placeholder input
        value={value} // Nilai input
        onChange={onChange} // Handler perubahan
        onBlur={onBlur} // Handler kehilangan fokus
        required={required} // Apakah wajib diisi
        className={`w-full border px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 shadow-sm focus:ring-2 focus:border-yellow-400 transition-all hover:shadow-[0_0_10px_#facc15] cursor-text ${
          error && touched // Jika ada error dan field sudah tersentuh
            ? "border-red-500 focus:ring-red-500" // Style untuk error
            : "border-gray-600 focus:ring-yellow-400" // Style normal
        }`}
      />
      {error && touched && ( // Jika ada error dan field sudah tersentuh, tampilkan pesan error
        <p className="mt-1 text-sm text-red-400 flex items-center">
          <FaExclamationCircle className="mr-1" /> {error}
        </p>
      )}
    </div>
  );
}

export default Register; // Ekspor komponen Register sebagai default