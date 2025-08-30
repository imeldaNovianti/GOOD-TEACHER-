import { useEffect, useState } from "react"; 

import { useParams, useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion"; 

function IsiKuisioner() { // Deklarasi komponen utama IsiKuisioner
  const { guruId } = useParams();  // Ambil parameter "guruId" dari URL, misal "/kuisioner/:guruId"

  const navigate = useNavigate();  //  untuk berpindah halaman secara programatik

  const siswaId = parseInt(localStorage.getItem("siswaId"));   // Ambil ID siswa dari localStorage, dikonversi ke number

  const [pertanyaan, setPertanyaan] = useState([]);  // State untuk menyimpan data pertanyaan kuisioner

  const [jawaban, setJawaban] = useState({});  // State untuk menyimpan jawaban siswa (object dengan key id pertanyaan)

  const [guru, setGuru] = useState(null);  // State untuk menyimpan data guru yang sedang dinilai

  const [loading, setLoading] = useState(true);  // State untuk menampilkan loading spinner saat fetch API

  const [submitting, setSubmitting] = useState(false);  // State untuk menandai submit sedang berlangsung

  const [sudahIsi, setSudahIsi] = useState(false);  // State untuk menandai apakah kuisioner sudah diisi sebelumnya

  const [quoteIndex, setQuoteIndex] = useState(0);  // State untuk indeks quotes motivasi

  const [activeQuestion, setActiveQuestion] = useState(0);  // State untuk pertanyaan yang sedang aktif

  const quotes = [  // Array quotes motivasi
    "🎓 Pendidikan adalah kunci masa depan yang cerah.",
    "📚 Penilaian jujurmu membantu meningkatkan kualitas pendidikan.",
    "🌟 Setiap jawaban adalah kontribusi berharga bagi kemajuan sekolah.",
    "🚀 Suaramu menentukan arah pembelajaran yang lebih baik.",
    "🤝 Guru dan siswa bersama membangun pendidikan berkualitas.",
    "💡 Feedback membangun adalah kunci perbaikan terus-menerus.",
    "🎯 Penilaian objektif membantu guru berkembang profesional.",
  ];

  useEffect(() => {  // useEffect untuk rotasi quotes setiap 5 detik
    const interval = setInterval(() => { // Set interval untuk perubahan quote
      setQuoteIndex((prev) => (prev + 1) % quotes.length); // loop index dengan modulus
    }, 5000); // Interval 5 detik
    return () => clearInterval(interval); // bersihkan interval saat unmount untuk prevent memory leak
  }, [quotes.length]); // Dependency array dengan quotes.length

  // useEffect untuk fetch data saat komponen mount
  useEffect(() => {
    // Validasi jika siswa belum login (tidak ada ID atau NaN)
    if (!siswaId || isNaN(siswaId)) { // Cek jika siswaId tidak ada atau NaN
      alert("❌ Siswa belum login!"); // beri alert
      navigate("/login"); // redirect ke halaman login
      return; // Hentikan eksekusi
    }

    // Cek apakah siswa sudah mengisi kuisioner untuk guru ini
    fetch( // Fetch API untuk cek status pengisian
      `http://localhost:8080/api/kuisioner-jawaban/cek?siswaId=${siswaId}&guruId=${guruId}`
    )
      .then((res) => res.json()) // parsing response menjadi JSON
      .then((data) => { // Handle data response
        if (data.sudahIsi) { // Jika sudah mengisi
          setSudahIsi(true); // set state sudah isi true
          setLoading(false); // stop loading
        } else { // Jika belum mengisi
          // Jika belum mengisi, ambil data guru dan pertanyaan secara paralel
          Promise.all([ // Gunakan Promise.all untuk fetch paralel
            fetch(`http://localhost:8080/api/guru-mapel/${guruId}`).then((res) => // Fetch data guru
              res.json() // Parse response JSON
            ),
            fetch("http://localhost:8080/api/pertanyaan").then((res) => // Fetch data pertanyaan
              res.json() // Parse response JSON
            ),
          ])
            .then(([guruData, pertanyaanData]) => { // Handle hasil fetch
              setGuru(guruData); // simpan data guru ke state
              setPertanyaan(pertanyaanData); // simpan pertanyaan ke state
              setLoading(false); // hentikan loading
            })
            .catch((err) => { // Handle error
              console.error("❌ Error fetch pertanyaan/guru:", err); // log error
              setLoading(false); // Hentikan loading
            });
        }
      })
      .catch((err) => { // Handle error fetch cek kuisioner
        console.error("❌ Error cek kuisioner:", err); // log error fetch cek kuisioner
        setLoading(false); // Hentikan loading
      });
  }, [guruId, siswaId, navigate]); // Dependency array dengan guruId, siswaId, navigate

  // Handler untuk update jawaban ketika siswa memilih
  const handleChange = (id, value) => { // Fungsi untuk handle perubahan jawaban
    setJawaban({ ...jawaban, [id]: value }); // merge jawaban lama + jawaban baru menggunakan spread operator
  };

  // Handler tombol navigasi pertanyaan sebelumnya
  const handlePrevQuestion = () => { // Fungsi untuk pindah ke pertanyaan sebelumnya
    if (activeQuestion > 0) { // Jika bukan pertanyaan pertama
      setActiveQuestion(activeQuestion - 1); // pindah ke pertanyaan sebelumnya
    }
  };

  // Handler tombol navigasi pertanyaan berikutnya
  const handleNextQuestion = () => { // Fungsi untuk pindah ke pertanyaan berikutnya
    if (activeQuestion < pertanyaan.length - 1) { // Jika bukan pertanyaan terakhir
      setActiveQuestion(activeQuestion + 1); // pindah ke pertanyaan berikutnya
    }
  };

  // Handler submit jawaban
  const handleSubmit = () => { // Fungsi untuk handle submit jawaban
    // Validasi jika ada pertanyaan yang belum diisi
    const belumDiisi = pertanyaan.filter((p) => !jawaban[p.id]); // Filter pertanyaan yang belum dijawab
    if (belumDiisi.length > 0) { // Jika ada yang belum diisi
      alert("⚠️ Masih ada pertanyaan yang belum diisi!"); // Tampilkan alert
      return; // Hentikan proses submit
    }

    // Format payload sesuai API
    const payload = pertanyaan.map((p) => ({ // Map pertanyaan menjadi format payload
      siswa: { id: siswaId }, // Sertakan ID siswa
      guruMapel: { id: parseInt(guruId) }, // Sertakan ID guru
      pertanyaan: { id: p.id }, // Sertakan ID pertanyaan
      jawaban: p.tipeJawaban === "SKALA" ? Number(jawaban[p.id]) : jawaban[p.id], // Konversi jawaban skala ke number
    }));

    setSubmitting(true); // set submitting state menjadi true
    fetch("http://localhost:8080/api/kuisioner-jawaban/submit", { // Fetch API untuk submit jawaban
      method: "POST", // Method POST
      headers: { "Content-Type": "application/json" }, // Set header Content-Type
      body: JSON.stringify(payload), // kirim data ke server dalam format JSON
    })
      .then((res) => { // Handle response
        if (!res.ok) throw new Error("Gagal simpan jawaban"); // error handling jika response tidak ok
        return res.text(); // Parse response sebagai text
      })
      .then((msg) => { // Handle success message
        alert("✅ " + msg); // alert sukses
        navigate("/siswa/kuisioner"); // redirect ke daftar kuisioner
      })
      .catch((err) => { // Handle error
        console.error("❌ Error submit:", err); // log error
        alert("❌ Gagal menyimpan kuisioner, coba lagi!"); // alert gagal
      })
      .finally(() => setSubmitting(false)); // stop submitting state baik success atau error
  };

  // UI Loading spinner
  if (loading) { // Jika dalam state loading
    return ( // Return JSX loading
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700"> {/* Container dengan gradient background */}
        <div className="text-center"> {/* Container teks di tengah */}
          <motion.div // Animasi spinner
            animate={{ rotate: 360 }} // animasi rotate 360 derajat
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }} // Transition untuk animasi
            className="w-16 h-16 border-4 border-red-300 border-t-transparent rounded-full mx-auto mb-4" // Styling spinner
          />
          <p className="text-red-100 font-semibold">Memuat kuisioner...</p> {/* Teks loading */}
        </div>
      </div>
    );
  }

  // UI jika kuisioner sudah diisi
  if (sudahIsi) { // Jika state sudahIsi true
    return ( // Return JSX untuk state sudah mengisi
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4"> {/* Container utama */}
        <motion.div // Animasi container
          className="max-w-md w-full p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-red-500/30 text-center relative overflow-hidden" // Styling container
          initial={{ opacity: 0, scale: 0.8 }} // Animasi awal
          animate={{ opacity: 1, scale: 1 }} // Animasi saat muncul
          transition={{ duration: 0.9 }} // Durasi transisi
        >
          {/* Background dekoratif */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div> {/* Efek latar belakang */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-300/10 rounded-full blur-2xl"></div> {/* Efek latar belakang */}

          <motion.div // Animasi icon
            className="text-6xl mb-6" // Styling icon
            initial={{ y: -20, opacity: 0 }} // Animasi awal
            animate={{ y: 0, opacity: 1 }} // Animasi saat muncul
            transition={{ duration: 0.6 }} // Durasi transisi
          >
            ✅ {/* Icon check */}
          </motion.div>

          <motion.h2 // Animasi judul
            className="text-2xl md:text-3xl font-extrabold text-white mb-4" // Styling judul
            initial={{ y: -20, opacity: 0 }} // Animasi awal
            animate={{ y: 0, opacity: 1 }} // Animasi saat muncul
            transition={{ duration: 0.9 }} // Durasi transisi
          >
            Kuisioner Telah Diisi {/* Teks judul */}
          </motion.h2>

          <motion.p // Animasi paragraf
            className="text-red-100 mb-6" // Styling paragraf
            initial={{ y: 10, opacity: 0 }} // Animasi awal
            animate={{ y: 0, opacity: 1 }} // Animasi saat muncul
            transition={{ duration: 0.6, delay: 0.2 }} // Durasi transisi dengan delay
          >
            Terima kasih! Anda sudah mengisi kuisioner untuk guru ini. Partisipasi Anda sangat berarti bagi peningkatan kualitas pendidikan. {/* Isi paragraf */}
          </motion.p>

          <motion.button // Animasi button
            onClick={() => navigate("/siswa/kuisioner")} // Navigasi saat diklik
            className="mt-4 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all" // Styling button
            whileHover={{ scale: 1.05 }} // Animasi saat hover
            whileTap={{ scale: 0.95 }} // Animasi saat tap
          >
            Kembali ke Daftar Kuisioner {/* Teks button */}
          </motion.button>

          <motion.div // Animasi info box
            className="mt-6 p-4 bg-red-800/30 rounded-xl border border-red-500/30 text-red-100 text-sm" // Styling info box
            initial={{ opacity: 0, scale: 0.9 }} // Animasi awal
            animate={{ opacity: 1, scale: 1 }} // Animasi saat muncul
            transition={{ duration: 0.8, delay: 0.3 }} // Durasi transisi dengan delay
          >
            💡 Jangan lupa mengisi kuisioner untuk guru lainnya! {/* Isi info box */}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Hitung progress pengisian kuisioner
  const total = pertanyaan.length; // Total pertanyaan
  const terisi = Object.keys(jawaban).length; // Jumlah jawaban yang sudah diisi
  const progress = Math.round((terisi / total) * 100); // Persentase progress

  return ( // Return JSX utama
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-8 relative overflow-hidden"> {/* Container utama dengan gradient */}
      {/* Background dekoratif */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div> {/* Efek latar belakang */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div> {/* Efek latar belakang */}

      {/* Header halaman */}
      <motion.header // Animasi header
        className="max-w-6xl mx-auto mb-8 flex justify-between items-center" // Styling header
        initial={{ opacity: 0, y: -20 }} // Animasi awal
        animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
        transition={{ duration: 0.6 }} // Durasi transisi
      >
        <button // Button kembali
          onClick={() => navigate("/siswa/kuisioner")} // Navigasi saat diklik
          className="flex items-center text-red-800 hover:text-red-900 font-bold transition-colors" // Styling button
        >
          <span className="mr-2">←</span> Kembali {/* Icon dan teks */}
        </button>
        <div className="text-sm text-red-700 font-medium">Siswa ID: {siswaId}</div> {/* Tampilkan ID siswa */}
      </motion.header>

      {/* Grid utama: sidebar guru + area kuisioner */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8"> {/* Grid container */}
        {/* Sidebar Guru */}
        <motion.div // Animasi sidebar
          className="lg:col-span-1" // Styling untuk lebar kolom
          initial={{ opacity: 0, x: -50 }} // Animasi awal
          animate={{ opacity: 1, x: 0 }} // Animasi saat muncul
          transition={{ duration: 0.6, delay: 0.2 }} // Durasi transisi dengan delay
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200 sticky top-6"> {/* Container sidebar */}
            <div className="text-center"> {/* Container konten tengah */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-4xl font-bold"> {/* Avatar guru */}
                {guru?.namaGuru?.charAt(0) || "G"} {/* Inisial guru atau 'G' jika tidak ada */}
              </div>
              <h3 className="text-xl font-bold text-red-900">{guru?.namaGuru}</h3> {/* Nama guru */}
              <p className="text-red-700 font-medium">{guru?.mataPelajaran}</p> {/* Mata pelajaran */}
              
              <div className="mt-6 p-4 bg-red-50 rounded-xl"> {/* Container progress bar */}
                <div className="flex justify-between items-center mb-2"> {/* Label progress */}
                  <span className="text-sm text-red-800 font-bold">Progress Kuisioner</span> {/* Teks progress */}
                  <span className="text-sm font-bold text-red-900">{progress}%</span> {/* Persentase progress */}
                </div>
                <div className="w-full bg-red-200 rounded-full h-2"> {/* Background progress bar */}
                  <motion.div // Animasi progress bar
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-700" // Styling progress bar
                    initial={{ width: 0 }} // Animasi awal
                    animate={{ width: `${progress}%` }} // Animasi lebar sesuai progress
                    transition={{ duration: 1 }} // Durasi animasi
                  />
                </div>
                <p className="text-xs text-red-700 mt-2 font-medium"> {/* Teks detail progress */}
                  {terisi} dari {total} pertanyaan terjawab {/* Jumlah pertanyaan terjawab */}
                </p>
              </div>
            </div>

            <hr className="my-6 border-red-200" /> {/* Pembatas */}

            {/* Info rating, jumlah penilaian, respons */}
            <div className="space-y-3"> {/* Container info */}
              <div className="flex items-center text-sm"> {/* Item info */}
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 mr-3 font-bold">⭐</div> {/* Icon */}
                <div> {/* Container teks */}
                  <p className="font-bold text-red-900">Rata-rata Rating</p> {/* Label */}
                  <p className="text-red-700">4.2 dari 5.0</p> {/* Nilai */}
                </div>
              </div>

              <div className="flex items-center text-sm"> {/* Item info */}
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 mr-3 font-bold">👥</div> {/* Icon */}
                <div> {/* Container teks */}
                  <p className="font-bold text-red-900">Total Penilaian</p> {/* Label */}
                  <p className="text-red-700">42 siswa</p> {/* Nilai */}
                </div>
              </div>

              <div className="flex items-center text-sm"> {/* Item info */}
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 mr-3 font-bold">📊</div> {/* Icon */}
                <div> {/* Container teks */}
                  <p className="font-bold text-red-900">Tingkat Respons</p> {/* Label */}
                  <p className="text-red-700">85% siswa mengisi</p> {/* Nilai */}
                </div>
              </div>
            </div>

            <hr className="my-6 border-red-200" /> {/* Pembatas */}

            {/* Tips penilaian */}
            <div className="bg-red-50 p-4 rounded-xl"> {/* Container tips */}
              <h4 className="font-bold text-red-900 text-sm mb-2">Tips Penilaian</h4> {/* Judul tips */}
              <ul className="text-xs text-red-700 space-y-1 font-medium"> {/* List tips */}
                <li>• Berikan penilaian yang jujur dan objektif</li> {/* Item tip */}
                <li>• Fokus pada aspek pembelajaran</li> {/* Item tip */}
                <li>• Sertakan saran konstruktif jika memungkinkan</li> {/* Item tip */}
              </ul>
            </div>
          </div>

          {/* Quote Box */}
          <motion.div // Animasi quote box
            className="mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white p-5 rounded-2xl shadow-lg" // Styling quote box
            initial={{ opacity: 0, y: 20 }} // Animasi awal
            animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
            transition={{ duration: 0.6, delay: 0.4 }} // Durasi transisi dengan delay
          >
            <motion.p // Animasi teks quote
              key={quoteIndex} // Key untuk trigger animasi saat ganti quote
              className="text-center font-bold" // Styling teks
              initial={{ opacity: 0 }} // Animasi awal
              animate={{ opacity: 1 }} // Animasi saat muncul
              transition={{ duration: 0.5 }} // Durasi transisi
            >
              {quotes[quoteIndex]} {/* Teks quote sesuai index */}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Area Kuisioner */}
        <motion.div // Animasi area kuisioner
          className="lg:col-span-2" // Styling untuk lebar kolom
          initial={{ opacity: 0, x: 50 }} // Animasi awal
          animate={{ opacity: 1, x: 0 }} // Animasi saat muncul
          transition={{ duration: 0.6, delay: 0.3 }} // Durasi transisi dengan delay
        >
          {/* Card utama kuisioner */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-red-200"> {/* Container kuisioner */}
            <div className="mb-8 text-center"> {/* Header kuisioner */}
              <h1 className="text-2xl md:text-3xl font-bold text-red-900 mb-2"> {/* Judul */}
                Kuisioner Penilaian Guru
              </h1>
              <p className="text-red-700 font-medium"> {/* Subjudul */}
                Berikan penilaian jujur untuk membantu peningkatan kualitas pembelajaran
              </p>
            </div>

            {/* Progress Navigation */}
            <div className="mb-8 flex overflow-x-auto pb-2"> {/* Container navigasi progress */}
              {pertanyaan.map((_, index) => ( // Map setiap pertanyaan menjadi button
                <button // Button untuk setiap pertanyaan
                  key={index} // Key unique
                  onClick={() => setActiveQuestion(index)} // Set pertanyaan aktif saat diklik
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-2 font-bold ${ // Styling button
                    activeQuestion === index // Jika pertanyaan aktif
                      ? "bg-red-700 text-white shadow-md" // Style aktif
                      : jawaban[pertanyaan[index]?.id] // Jika sudah dijawab
                      ? "bg-red-500 text-white shadow-sm" // Style terjawab
                      : "bg-red-100 text-red-800" // Style belum terjawab
                  }`}
                >
                  {index + 1} {/* Nomor pertanyaan */}
                </button>
              ))}
            </div>

            {/* Question Card */}
            {pertanyaan.length > 0 && ( // Jika ada pertanyaan
              <motion.div // Animasi card pertanyaan
                key={activeQuestion} // Key untuk trigger animasi saat ganti pertanyaan
                initial={{ opacity: 0, y: 20 }} // Animasi awal
                animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
                transition={{ duration: 0.4 }} // Durasi transisi
                className="mb-8 p-6 border border-red-200 rounded-xl bg-red-50/30" // Styling card
              >
                <div className="flex justify-between items-start mb-4"> {/* Header pertanyaan */}
                  <h3 className="text-lg font-bold text-red-900"> {/* Judul pertanyaan */}
                    Pertanyaan {activeQuestion + 1} dari {pertanyaan.length} {/* Nomor pertanyaan */}
                  </h3>
                  <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold"> {/* Badge tipe jawaban */}
                    {pertanyaan[activeQuestion].tipeJawaban === "SKALA" ? "Skala" : "Teks"} {/* Tampilkan tipe */}
                  </span>
                </div>

                <p className="text-red-800 mb-6 text-lg font-medium"> {/* Teks pertanyaan */}
                  {pertanyaan[activeQuestion].teks}
                </p>

                {/* Input jawaban skala atau teks */}
                {pertanyaan[activeQuestion].tipeJawaban === "SKALA" ? ( // Jika tipe skala
                  <div className="flex flex-wrap gap-3 justify-center"> {/* Container opsi skala */}
                    {[1, 2, 3, 4, 5].map((num) => ( // Map angka 1-5 menjadi opsi
                      <motion.label // Label untuk radio button
                        key={num} // Key unique
                        whileHover={{ scale: 1.05 }} // Animasi hover
                        whileTap={{ scale: 0.95 }} // Animasi tap
                        className={`flex flex-col items-center cursor-pointer p-3 rounded-xl transition-all font-bold ${ // Styling label
                          jawaban[pertanyaan[activeQuestion].id] === num // Jika terpilih
                            ? "bg-red-700 text-white shadow-lg" // Style terpilih
                            : "bg-white text-red-800 hover:bg-red-100 shadow-md" // Style tidak terpilih
                        }`}
                      >
                        <input // Input radio
                          type="radio" // Tipe radio
                          name={`q-${pertanyaan[activeQuestion].id}`} // Name berdasarkan ID pertanyaan
                          value={num} // Value angka
                          checked={jawaban[pertanyaan[activeQuestion].id] === num} // Checked jika sesuai value
                          onChange={() => handleChange(pertanyaan[activeQuestion].id, num)} // Handle perubahan
                          className="hidden" // Sembunyikan input default
                        />
                        <span className="text-2xl mb-1"> {/* Emoji sesuai angka */}
                          {num === 1 ? "😠" : num === 2 ? "😕" : num === 3 ? "😐" : num === 4 ? "🙂" : "😍"}
                        </span>
                        <span className="text-sm">{num}</span> {/* Angka */}
                      </motion.label>
                    ))}
                  </div>
                ) : ( // Jika tipe teks
                  <div className="relative"> {/* Container textarea */}
                    <textarea // Textarea untuk jawaban teks
                      className="w-full border border-red-300 rounded-lg p-4 focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium" // Styling
                      rows="4" // Jumlah baris
                      value={jawaban[pertanyaan[activeQuestion].id] || ""} // Value dari state jawaban
                      onChange={(e) => handleChange(pertanyaan[activeQuestion].id, e.target.value)} // Handle perubahan
                      placeholder="Tuliskan jawaban Anda di sini..." // Placeholder
                      maxLength="500" // Batas karakter
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-red-600 font-medium"> {/* Counter karakter */}
                      {jawaban[pertanyaan[activeQuestion].id]?.length || 0}/500 karakter {/* Tampilkan jumlah karakter */}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8"> {/* Container navigasi button */}
              <motion.button // Button sebelumnya
                onClick={handlePrevQuestion} // Handle klik
                disabled={activeQuestion === 0} // Disable jika di pertanyaan pertama
                className={`px-5 py-2.5 rounded-lg font-bold flex items-center ${ // Styling button
                  activeQuestion === 0 // Jika disabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Style disabled
                    : "bg-red-200 text-red-800 hover:bg-red-300" // Style aktif
                }`}
                whileHover={{ scale: activeQuestion === 0 ? 1 : 1.05 }} // Animasi hover jika tidak disabled
              >
                <span className="mr-2">←</span> Sebelumnya {/* Teks button */}
              </motion.button>

              {activeQuestion < pertanyaan.length - 1 ? ( // Jika bukan pertanyaan terakhir
                <motion.button // Button selanjutnya
                  onClick={handleNextQuestion} // Handle klik
                  className="px-5 py-2.5 rounded-lg font-bold bg-red-700 text-white hover:bg-red-800 flex items-center shadow-md" // Styling
                  whileHover={{ scale: 1.05 }} // Animasi hover
                >
                  Selanjutnya <span className="ml-2">→</span> {/* Teks button */}
                </motion.button>
              ) : ( // Jika pertanyaan terakhir
                <motion.button // Button submit
                  onClick={handleSubmit} // Handle klik
                  disabled={submitting} // Disable jika sedang submitting
                  className={`px-5 py-2.5 rounded-lg font-bold flex items-center ${ // Styling button
                    submitting // Jika submitting
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed" // Style disabled
                      : "bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-md" // Style aktif
                  }`}
                  whileHover={{ scale: submitting ? 1 : 1.05 }} // Animasi hover jika tidak submitting
                >
                  {submitting ? ( // Jika sedang submitting
                    <>
                      <span className="mr-2">⏳</span> Menyimpan... {/* Teks loading */}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✅</span> Simpan Semua Jawaban {/* Teks submit */}
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Quick Navigation Buttons */}
            <div className="mt-6 pt-6 border-t border-red-200"> {/* Container navigasi cepat */}
              <h4 className="text-sm font-bold text-red-900 mb-3">Navigasi Cepat:</h4> {/* Judul */}
              <div className="flex flex-wrap gap-2"> {/* Container button navigasi */}
                {pertanyaan.map((_, index) => ( // Map setiap pertanyaan menjadi button
                  <button // Button untuk navigasi cepat
                    key={index} // Key unique
                    onClick={() => setActiveQuestion(index)} // Set pertanyaan aktif saat diklik
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-bold ${ // Styling button
                      activeQuestion === index // Jika pertanyaan aktif
                        ? "bg-red-700 text-white shadow-sm" // Style aktif
                        : jawaban[pertanyaan[index]?.id] // Jika sudah dijawab
                        ? "bg-red-500 text-white" // Style terjawab
                        : "bg-red-100 text-red-800" // Style belum terjawab
                    }`}
                  >
                    {index + 1} {/* Nomor pertanyaan */}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box Petunjuk */}
          <motion.div // Animasi info box
            className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5" // Styling info box
            initial={{ opacity: 0, y: 20 }} // Animasi awal
            animate={{ opacity: 1, y: 0 }} // Animasi saat muncul
            transition={{ duration: 0.6, delay: 0.5 }} // Durasi transisi dengan delay
          >
            <h4 className="font-bold text-red-900 mb-2">📋 Petunjuk Pengisian</h4> {/* Judul petunjuk */}
            <ul className="text-sm text-red-800 space-y-1 font-medium"> {/* List petunjuk */}
              <li>• Untuk pertanyaan skala: 1 (Sangat Tidak Puas) hingga 5 (Sangat Puas)</li> {/* Item petunjuk */}
              <li>• Jawaban akan disimpan otomatis saat Anda berpindah pertanyaan</li> {/* Item petunjuk */}
              <li>• Anda dapat kembali ke pertanyaan sebelumnya untuk mengubah jawaban</li> {/* Item petunjuk */}
              <li>• Tekan "Simpan Semua Jawaban" setelah mengisi semua pertanyaan</li> {/* Item petunjuk */}
            </ul>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}

export default IsiKuisioner; // Export komponen utama