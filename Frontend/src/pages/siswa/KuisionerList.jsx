import { useEffect, useState } from "react"; // import React hooks useEffect untuk side effect dan useState untuk state lokal
import { useNavigate } from "react-router-dom"; // import hook useNavigate untuk navigasi programatik
import { motion } from "framer-motion"; // import motion dari framer-motion untuk animasi komponen

function KuisionerList() { // deklarasi komponen fungsi KuisionerList
  const [guruList, setGuruList] = useState([]); // state untuk menyimpan daftar guru yang di-fetch
  const [loading, setLoading] = useState(true); // state untuk menandai status loading data
  const [search, setSearch] = useState(""); // state untuk menyimpan teks pencarian guru
  const [filter, setFilter] = useState("all"); // state untuk menyimpan filter mata pelajaran
  const navigate = useNavigate(); // hook navigate untuk pindah halaman secara programatik

  useEffect(() => { // hook useEffect untuk fetch data saat komponen mount
    fetch("http://localhost:8080/api/guru-mapel") // fetch data semua guru dari backend
      .then((res) => res.json()) // parsing response menjadi JSON
      .then((data) => { // jika berhasil fetch
        setGuruList(data); // simpan data guru ke state guruList
        setLoading(false); // hentikan loading
      })
      .catch((err) => console.error("❌ Error fetch guru", err)); // log error jika gagal fetch
  }, []); // dependensi kosong berarti hanya dijalankan sekali saat mount

  if (loading) return <p className="p-6 animate-pulse">⏳ Loading...</p>; // tampilkan teks loading jika data belum siap

  // Filter & search
  const filtered = guruList.filter((g) => { // filter guru berdasarkan search dan filter mapel
    const cocokSearch = g.namaGuru.toLowerCase().includes(search.toLowerCase()); // cek kecocokan nama guru dengan search
    const cocokFilter = filter === "all" || g.mataPelajaran === filter; // cek kecocokan mata pelajaran dengan filter
    return cocokSearch && cocokFilter; // return true jika kedua kondisi terpenuhi
  });

  // Ambil list mata pelajaran unik
  const mapelList = [...new Set(guruList.map((g) => g.mataPelajaran))]; // buat array unik mata pelajaran dari guruList

  return ( // return JSX komponen utama
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white p-8"> {/* container utama dengan background gradient dan padding */}
      {/* Hero Section */}
      <motion.div // container hero section dengan animasi
        className="max-w-5xl mx-auto text-center mb-10" // max lebar, center, margin bawah
        initial={{ opacity: 0, y: -40 }} // animasi awal: transparan dan sedikit di atas
        animate={{ opacity: 1, y: 0 }} // animasi akhir: muncul dan posisi normal
        transition={{ duration: 0.8 }} // durasi animasi 0.8 detik
      >
        <h1 // judul hero
          className="text-3xl md:text-4xl font-extrabold mb-3 flex items-center justify-center gap-2 text-red-700" // styling teks
          style={{
            textShadow:
              "0 0 8px rgba(255,0,0,0.6), 0 0 15px rgba(255,215,0,0.7)", // efek shadow teks
          }}
        >
          <motion.span // icon animasi
            animate={{ y: [0, -8, 0] }} // animasi naik turun berulang
            transition={{ repeat: Infinity, duration: 1.5 }} // loop terus-menerus
          >
            📋 {/* icon clipboard */}
          </motion.span>
          Pilih Guru untuk Dinilai {/* teks judul */}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto"> {/* deskripsi hero */}
          Suara Anda membantu meningkatkan kualitas pembelajaran. Pilih guru
          yang ingin Anda isi kuisioner, lalu berikan penilaian terbaik ✨
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div // container search dan filter
        className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between mb-6 gap-4" // responsive layout
        initial={{ opacity: 0, x: -40 }} // animasi awal: transparan dan geser kiri
        animate={{ opacity: 1, x: 0 }} // animasi akhir: muncul dan posisi normal
        transition={{ duration: 0.8 }} // durasi animasi
      >
        <input // input pencarian
          type="text" // tipe text
          placeholder="🔍 Cari guru..." // placeholder
          value={search} // bind state search
          onChange={(e) => setSearch(e.target.value)} // update state saat input berubah
          className="w-full md:w-1/2 border rounded-lg p-3 shadow focus:ring-2 focus:ring-red-400 focus:outline-none transition-all" // styling input
          style={{
            boxShadow: // efek shadow saat ada teks
              search.length > 0
                ? "0 0 12px rgba(255,0,0,0.6), 0 0 20px rgba(255,215,0,0.8)"
                : "none",
          }}
        />
        <select // select filter mapel
          value={filter} // bind state filter
          onChange={(e) => setFilter(e.target.value)} // update state saat filter berubah
          className="border rounded-lg p-3 shadow focus:ring-2 focus:ring-red-400 transition-all" // styling select
          style={{
            boxShadow: // efek shadow saat filter tidak all
              filter !== "all"
                ? "0 0 12px rgba(255,0,0,0.6), 0 0 20px rgba(255,215,0,0.8)"
                : "none",
          }}
        >
          <option value="all">Semua Mapel</option> {/* opsi default */}
          {mapelList.map((m, i) => ( // mapping mata pelajaran unik
            <option key={i} value={m}> {/* key unik */}
              {m} {/* nama mata pelajaran */}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Progress Info */}
      <motion.div // container progress info
        className="max-w-5xl mx-auto mb-8 bg-white p-4 rounded-xl shadow flex items-center justify-between" // styling
        initial={{ opacity: 0, scale: 0.9 }} // animasi awal: transparan dan sedikit mengecil
        animate={{ opacity: 1, scale: 1 }} // animasi akhir
        transition={{ duration: 0.6, delay: 0.3 }} // durasi + delay
        style={{
          boxShadow:
            "0 0 8px rgba(255,0,0,0.3), 0 0 16px rgba(255,215,0,0.5)", // shadow
        }}
      >
        <p className="text-gray-700 font-medium"> {/* total guru */}
          Total Guru: <span className="font-bold">{guruList.length}</span> {/* jumlah guru */}
        </p>
        <p className="text-gray-700 font-medium"> {/* jumlah yang ditampilkan */}
          Ditampilkan: <span className="font-bold">{filtered.length}</span>
        </p>
      </motion.div>

      {/* Guru Cards */}
      <motion.div // container grid guru
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // responsive grid
        initial="hidden" // state awal animasi
        animate="show" // state akhir animasi
        variants={{ // definisi variants framer-motion
          hidden: {}, // tidak ada perubahan awal
          show: { // transisi muncul
            transition: {
              staggerChildren: 0.15, // animasi muncul anak stagger 0.15s
            },
          },
        }}
      >
        {filtered.length > 0 ? ( // jika ada guru yang ditampilkan
          filtered.map((guru) => ( // mapping guru
            <motion.div // card guru
              key={guru.id} // key unik
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition transform" // styling
              variants={{ // animasi muncul per card
                hidden: { opacity: 0, y: 40 }, // awal transparan dan geser bawah
                show: { opacity: 1, y: 0 }, // akhir muncul normal
              }}
              whileHover={{ // animasi hover
                scale: 1.05, // sedikit membesar
                boxShadow:
                  "0 0 15px rgba(255,0,0,0.6), 0 0 25px rgba(255,215,0,0.8)", // efek shadow
              }}
              whileTap={{ // animasi saat klik/tap
                scale: 0.97, // sedikit mengecil
                boxShadow:
                  "0 0 20px rgba(255,0,0,0.8), 0 0 35px rgba(255,215,0,1)", // efek shadow lebih kuat
              }}
            >
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl mb-4"> {/* icon avatar */}
                👨‍🏫 {/* icon guru */}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1"> {/* nama guru */}
                {guru.namaGuru} {/* render nama */}
              </h3>
              <p className="text-sm text-gray-500 mb-4"> {/* mata pelajaran */}
                {guru.mataPelajaran} {/* render mapel */}
              </p>
              <motion.button // tombol isi kuisioner
                onClick={() => navigate(`/siswa/kuisioner/${guru.id}`)} // navigasi ke halaman kuisioner guru
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition" // styling tombol
                whileHover={{ // animasi hover
                  boxShadow:
                    "0 0 12px rgba(255,0,0,0.7), 0 0 20px rgba(255,215,0,0.9)",
                }}
                whileTap={{ // animasi klik
                  scale: 0.95, // sedikit mengecil
                  boxShadow:
                    "0 0 20px rgba(255,0,0,0.9), 0 0 35px rgba(255,215,0,1)",
                }}
              >
                ✏️ Isi Kuisioner {/* teks tombol */}
              </motion.button>
            </motion.div>
          ))
        ) : ( // jika tidak ada guru
          <p className="text-center col-span-full text-gray-500 italic"> {/* pesan kosong */}
            Tidak ada guru ditemukan.
          </p>
        )}
      </motion.div>

      {/* Sidebar Motivasi */}
      <motion.div // container motivasi di bawah
        className="max-w-4xl mx-auto mt-12 text-center bg-gradient-to-r from-yellow-100 to-red-100 p-6 rounded-xl shadow" // styling gradient + shadow
        initial={{ opacity: 0, y: 50 }} // animasi awal: bawah dan transparan
        whileInView={{ opacity: 1, y: 0 }} // animasi saat view muncul
        viewport={{ once: true }} // animasi hanya sekali
        transition={{ duration: 0.8 }} // durasi animasi
        style={{
          boxShadow:
            "0 0 12px rgba(255,0,0,0.4), 0 0 22px rgba(255,215,0,0.7)", // efek shadow
        }}
      >
        <h4 className="text-lg font-bold text-gray-700 mb-2"> {/* teks motivasi */}
          “Menilai guru bukan sekadar kewajiban, tapi kontribusi untuk masa depan.”
        </h4>
        <p className="text-sm text-gray-600"> {/* teks tambahan */}
          Dengan mengisi kuisioner ini, kamu ikut serta dalam meningkatkan mutu
          pembelajaran di sekolah 🌟
        </p>
      </motion.div>
    </div> // tutup container utama
  );
}

export default KuisionerList; // export komponen agar bisa digunakan di tempat lain
