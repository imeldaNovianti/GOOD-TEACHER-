import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function KuisionerList() {
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
      .catch((err) => console.error("❌ Error fetch guru", err));
  }, []);

  if (loading) return <p className="p-6">⏳ Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-red-700">📋 Daftar Guru</h2>

      <table className="w-full border rounded overflow-hidden">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="p-3 text-left">Nama Guru</th>
            <th className="p-3 text-left">Mata Pelajaran</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {guruList.map((guru, idx) => (
            <tr
              key={guru.id}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } border-b hover:bg-gray-100 transition`}
            >
              <td className="p-3">{guru.namaGuru}</td>
              <td className="p-3">{guru.mataPelajaran}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => navigate(`/siswa/kuisioner/${guru.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow transition"
                >
                  ✏️ Isi Kuisioner
                </button>
              </td>
            </tr>
          ))}
          {guruList.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="text-center text-gray-500 py-4 italic"
              >
                Tidak ada data guru tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default KuisionerList;
