import { useEffect, useState } from "react";
import ChartDashboard from "../../components/admin/ChartDashboard";

function Dashboard() {
  const [statistikGuru, setStatistikGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ringkasan
  const [summary, setSummary] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    totalKuisioner: 0,
  });

  useEffect(() => {
    // Ambil data statistik guru
    Promise.all([
      fetch("http://localhost:8080/api/kuisioner-jawaban/statistik/guru").then(
        (res) => res.json()
      ),
      fetch("http://localhost:8080/api/guru-mapel").then((res) => res.json()),
      fetch("http://localhost:8080/api/kuisioner-jawaban").then((res) =>
        res.json()
      ),
      fetch("http://localhost:8080/api/users?siswaOnly=true").then((res) =>
        res.json()
      ), // misalnya ada endpoint ini
    ])
      .then(([statistikData, guruData, kuisionerData, siswaData]) => {
        setStatistikGuru(statistikData);
        setSummary({
          totalGuru: guruData.length,
          totalSiswa: siswaData.length,
          totalKuisioner: kuisionerData.length,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetch dashboard:", err);
        setError("Gagal memuat data dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">⏳ Memuat dashboard...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  // siapkan data untuk chart
  const chartData = {
    labels: statistikGuru.map((d) => `${d.guru} (${d.mapel})`),
    values: statistikGuru.map((d) => d.rataRata),
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-red-700">
        📊 Dashboard Statistik
      </h2>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Jumlah Guru</h3>
          <p className="text-3xl font-bold text-red-600">
            {summary.totalGuru}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Jumlah Siswa</h3>
          <p className="text-3xl font-bold text-red-600">
            {summary.totalSiswa}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Kuisioner Terisi
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {summary.totalKuisioner}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">
          Rata-rata Penilaian per Guru
        </h3>
        {statistikGuru.length > 0 ? (
          <ChartDashboard data={chartData} />
        ) : (
          <p className="text-gray-600">Belum ada data penilaian.</p>
        )}
      </div>

      {/* Tabel detail */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">Detail Statistik Guru</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="p-2 border">Nama Guru</th>
              <th className="p-2 border">Mata Pelajaran</th>
              <th className="p-2 border">Rata-rata Penilaian</th>
            </tr>
          </thead>
          <tbody>
            {statistikGuru.map((item, idx) => (
              <tr
                key={idx}
                className={`border-b ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-2 border">{item.guru}</td>
                <td className="p-2 border">{item.mapel}</td>
                <td className="p-2 border text-center font-semibold text-red-700">
                  {Number(item.rataRata).toFixed(2)}
                </td>
              </tr>
            ))}
            {statistikGuru.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-4 italic"
                >
                  Tidak ada data statistik tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
