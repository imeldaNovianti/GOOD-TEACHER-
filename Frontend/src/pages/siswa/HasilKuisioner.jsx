import { useEffect, useState } from "react";

function HasilKuisioner({ siswaId = 1 }) {
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ambil hasil kuisioner berdasarkan siswaId
    fetch(`http://localhost:8080/api/kuisioner-jawaban/siswa/${siswaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch hasil kuisioner");
        return res.json();
      })
      .then((data) => {
        setHasil(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetch hasil:", err);
        setLoading(false);
      });
  }, [siswaId]);

  if (loading) return <p className="p-6">⏳ Loading hasil...</p>;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-700">
        📊 Hasil Kuisioner Anda
      </h2>

      {hasil.length === 0 ? (
        <p className="text-gray-600 italic">
          Belum ada jawaban kuisioner yang tersimpan.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-3 border">Guru</th>
                <th className="p-3 border">Mata Pelajaran</th>
                <th className="p-3 border">Pertanyaan</th>
                <th className="p-3 border">Jawaban</th>
                <th className="p-3 border">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3 border">{item.guruMapel?.namaGuru}</td>
                  <td className="p-3 border">
                    {item.guruMapel?.mataPelajaran}
                  </td>
                  <td className="p-3 border">{item.pertanyaan?.teks}</td>
                  <td className="p-3 border text-center font-semibold text-red-700">
                    {item.jawaban}
                  </td>
                  <td className="p-3 border text-gray-600">
                    {new Date(item.createdAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HasilKuisioner;
