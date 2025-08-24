import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function IsiKuisioner({ siswaId = 1 }) {
  const { guruId } = useParams(); // dari URL /siswa/kuisioner/:guruId
  const [pertanyaan, setPertanyaan] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [guru, setGuru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch data guru + pertanyaan
  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8080/api/guru-mapel/${guruId}`).then((res) =>
        res.json()
      ),
      fetch("http://localhost:8080/api/pertanyaan").then((res) => res.json()),
    ])
      .then(([guruData, pertanyaanData]) => {
        setGuru(guruData);
        setPertanyaan(pertanyaanData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetch:", err);
        setLoading(false);
      });
  }, [guruId]);

  // handle input
  const handleChange = (id, value) => {
    setJawaban({ ...jawaban, [id]: value });
  };

  // submit kuisioner
  const handleSubmit = () => {
    // validasi: pastikan semua pertanyaan sudah diisi
    const belumDiisi = pertanyaan.filter((p) => !jawaban[p.id]);
    if (belumDiisi.length > 0) {
      alert("⚠️ Masih ada pertanyaan yang belum diisi!");
      return;
    }

    // payload list of jawaban
    const payload = pertanyaan.map((p) => ({
      siswa: { id: siswaId },
      guruMapel: { id: parseInt(guruId) },
      pertanyaan: { id: p.id },
      jawaban:
        p.tipeJawaban === "SKALA"
          ? Number(jawaban[p.id]) // integer untuk skala
          : jawaban[p.id],
    }));

    setSubmitting(true);
    fetch("http://localhost:8080/api/kuisioner-jawaban/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal simpan jawaban");
        return res.text();
      })
      .then((msg) => {
        alert("✅ " + msg);
        navigate("/siswa/kuisioner");
      })
      .catch((err) => {
        console.error("❌ Error submit:", err);
        alert("❌ Gagal menyimpan kuisioner, coba lagi!");
      })
      .finally(() => setSubmitting(false));
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-red-700">
        Kuisioner untuk {guru?.namaGuru}{" "}
        <span className="text-gray-600">({guru?.mataPelajaran})</span>
      </h2>

      {pertanyaan.map((p) => (
        <div
          key={p.id}
          className="mb-6 p-4 border rounded bg-gray-50 shadow-sm"
        >
          <p className="font-medium">{p.teks}</p>

          {p.tipeJawaban === "SKALA" ? (
            <div className="flex gap-4 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`q-${p.id}`}
                    value={num}
                    checked={jawaban[p.id] === num}
                    onChange={() => handleChange(p.id, num)}
                  />
                  {num}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full border rounded p-2 mt-2"
              rows="3"
              value={jawaban[p.id] || ""}
              onChange={(e) => handleChange(p.id, e.target.value)}
              placeholder="Tulis jawaban Anda..."
            />
          )}
        </div>
      ))}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate("/siswa/kuisioner")}
          className="px-5 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold shadow"
        >
          ⬅️ Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-5 py-2 rounded font-semibold shadow ${
            submitting
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {submitting ? "Menyimpan..." : "✅ Simpan Jawaban"}
        </button>
      </div>
    </div>
  );
}

export default IsiKuisioner;
