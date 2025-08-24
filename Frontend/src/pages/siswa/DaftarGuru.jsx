import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DaftarGuru() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/guru-mapel")
      .then((res) => res.json())
      .then((data) => {
        setGuruList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Gagal fetch guru_mapel", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-maroon-700">
        📋 Daftar Guru & Mata Pelajaran
      </h2>

      <div className="space-y-4">
        {guruList.map((g) => (
          <div
            key={g.id}
            className="flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white"
          >
            <div>
              <p className="font-semibold text-lg">{g.namaGuru}</p>
              <p className="text-gray-600">{g.mataPelajaran}</p>
            </div>
            <button
              onClick={() => navigate(`/siswa/kuisioner/${g.id}`)}
              className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-md"
            >
              Isi Kuisioner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DaftarGuru;
