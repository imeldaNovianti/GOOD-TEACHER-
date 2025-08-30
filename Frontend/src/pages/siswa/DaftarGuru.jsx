import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
function DaftarGuru() { // deklar komponen fungsional DaftarGuru
  const [guruList, setGuruList] = useState([]); // state untuk menyimpan daftar guru, awalnya array kosong
  const [loading, setLoading] = useState(true); // state untuk menandai loading data, awalnya true
  const navigate = useNavigate(); // hook navigate untuk berpindah halaman secara programatik

  useEffect(() => { // hook untuk menjalankan efek samping setelah render pertama
    fetch("http://localhost:8080/api/guru-mapel") // request ke API backend untuk mengambil data guru dan mata pelajaran
      .then((res) => res.json()) // ubah response menjadi format JSON
      .then((data) => { // ketika fetch berhasil
        setGuruList(data); // simpan data ke state guruList
        setLoading(false); // hentikan loading karena data sudah diterima
      })
      .catch((err) => { // jika fetch gagal
        console.error("❌ Gagal fetch guru_mapel", err); // tampilkan error di console
        setLoading(false); // hentikan loading meskipun gagal
      });
  }, []); // dependency array kosong -> useEffect hanya dijalankan sekali saat komponen mount

  if (loading) return <p className="p-6">Loading...</p>; // jika sedang loading, tampilkan teks Loading...

  return ( // render UI ketika data sudah tersedia
    <div className="max-w-4xl mx-auto p-6"> {/* container utama dengan max lebar 4xl, center, padding 6 */}
      <h2 className="text-2xl font-bold mb-6 text-maroon-700"> {/* judul halaman */}
        📋 Daftar Guru & Mata Pelajaran {/* isi judul */}
      </h2>

      <div className="space-y-4"> {/* wrapper untuk daftar guru, beri jarak antar item 4 */}
        {guruList.map((g) => ( // loop setiap guru dalam guruList
          <div
            key={g.id} // key unik untuk setiap elemen list, gunakan id guru
            className="flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white" // style container item guru: flex, space, border, shadow
          >
            <div> {/* wrapper informasi guru */}
              <p className="font-semibold text-lg">{g.namaGuru}</p> {/* tampilkan nama guru */}
              <p className="text-gray-600">{g.mataPelajaran}</p> {/* tampilkan mata pelajaran guru */}
            </div>
            <button
              onClick={() => navigate(`/siswa/kuisioner/${g.id}`)} // navigasi ke halaman kuisioner untuk guru tertentu
              className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-md" // styling tombol: warna, hover, padding, border-radius
            >
              Isi Kuisioner {/* teks tombol */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaftarGuru; // export komponen agar bisa dipakai di file lain
