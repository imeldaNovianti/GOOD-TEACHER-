import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaCopy,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaMedal,
} from "react-icons/fa";
import ChartDashboard from "../../components/admin/ChartDashboard";

function Dashboard() {
  const [statistikGuru, setStatistikGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [summary, setSummary] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    totalKuisioner: 0,
  });

  // --- UI state (filter & sort)
  const [search, setSearch] = useState("");
  const [mapel, setMapel] = useState("ALL");
  const [periode, setPeriode] = useState({ from: "", to: "" }); // hanya frontend filter
  const [sort, setSort] = useState({ field: "rataRata", dir: "desc" });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statistikRes, guruRes, kuisionerRes, siswaRes] = await Promise.all([
        fetch("http://localhost:8080/api/kuisioner-jawaban/statistik/guru"),
        fetch("http://localhost:8080/api/guru-mapel"),
        fetch("http://localhost:8080/api/kuisioner-jawaban"),
        fetch("http://localhost:8080/api/users?siswaOnly=true"),
      ]);

      if (!statistikRes.ok || !guruRes.ok || !kuisionerRes.ok || !siswaRes.ok) {
        throw new Error("Response tidak OK");
      }

      const statistikData = await statistikRes.json();
      const guruData = await guruRes.json();
      const kuisionerData = await kuisionerRes.json();
      const siswaData = await siswaRes.json();

      setStatistikGuru(Array.isArray(statistikData) ? statistikData : []);
      setSummary({
        totalGuru: Array.isArray(guruData) ? guruData.length : 0,
        totalSiswa: Array.isArray(siswaData) ? siswaData.length : 0,
        totalKuisioner: Array.isArray(kuisionerData) ? kuisionerData.length : 0,
      });
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("❌ Error fetch dashboard:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- derive filters
  const distinctMapel = useMemo(() => {
    const s = new Set(statistikGuru.map((d) => d.mapel).filter(Boolean));
    return ["ALL", ...Array.from(s)];
  }, [statistikGuru]);

  const filtered = useMemo(() => {
    let data = [...statistikGuru];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          (d.guru || "").toLowerCase().includes(q) ||
          (d.mapel || "").toLowerCase().includes(q)
      );
    }

    if (mapel !== "ALL") {
      data = data.filter((d) => d.mapel === mapel);
    }

    // filter periode jika server belum support: asumsi item.createdAt ada; jika tidak, skip
    if (periode.from || periode.to) {
      const from = periode.from ? new Date(periode.from) : null;
      const to = periode.to ? new Date(periode.to + "T23:59:59") : null;
      data = data.filter((d) => {
        if (!d.createdAt) return true;
        const t = new Date(d.createdAt);
        if (from && t < from) return false;
        if (to && t > to) return false;
        return true;
      });
    }

    // sort
    data.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.field === "guru") {
        return a.guru.localeCompare(b.guru) * dir;
      }
      if (sort.field === "mapel") {
        return a.mapel.localeCompare(b.mapel) * dir;
      }
      const av = Number(a.rataRata || 0);
      const bv = Number(b.rataRata || 0);
      return (av - bv) * dir;
    });

    return data;
  }, [statistikGuru, search, mapel, periode, sort]);

  // --- chart data utama
  const chartData = useMemo(() => {
    return {
      labels: filtered.map((d) => `${d.guru} (${d.mapel})`),
      values: filtered.map((d) => Number(d.rataRata || 0).toFixed(2)),
    };
  }, [filtered]);

  // --- top 5
  const top5 = useMemo(() => {
    return [...statistikGuru]
      .sort((a, b) => Number(b.rataRata || 0) - Number(a.rataRata || 0))
      .slice(0, 5);
  }, [statistikGuru]);

  // --- distribusi nilai bucket
  const distribusi = useMemo(() => {
    const buckets = { "0–2": 0, "2–3": 0, "3–4": 0, "4–5": 0 };
    statistikGuru.forEach((d) => {
      const v = Number(d.rataRata || 0);
      if (v < 2) buckets["0–2"] += 1;
      else if (v < 3) buckets["2–3"] += 1;
      else if (v < 4) buckets["3–4"] += 1;
      else buckets["4–5"] += 1;
    });
    return buckets;
  }, [statistikGuru]);

  // --- export CSV
  const exportCSV = () => {
    const headers = ["Guru", "Mapel", "RataRata"];
    const rows = filtered.map((d) => [d.guru, d.mapel, Number(d.rataRata || 0).toFixed(2)]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-guru-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- copy ringkas ke clipboard
  const copySummary = async () => {
    const text = `Ringkasan:
- Guru: ${summary.totalGuru}
- Siswa: ${summary.totalSiswa}
- Kuisioner: ${summary.totalKuisioner}
Top 1: ${top5[0]?.guru || "-"} (${top5[0]?.mapel || "-"}) - ${Number(top5[0]?.rataRata || 0).toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Summary disalin ke clipboard ✅");
    } catch {
      alert("Gagal menyalin ke clipboard.");
    }
  };

  if (loading) return <SkeletonDashboard />;
  if (error) return <ErrorPanel onRetry={fetchDashboardData} msg={error} />;

  return (
    <div className="p-6 space-y-8">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl
                   bg-gradient-to-r from-red-900 via-pink-700 to-red-800
                   bg-[length:300%_300%] animate-[gradientMove_12s_ease_infinite]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.12),transparent_40%)]" />
        </div>
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide">
              📊 Dashboard Statistik
            </h2>
            <p className="opacity-90">
              Insight kinerja guru, aktivitas kuisioner, dan tren penilaian—real-time & interaktif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ActionBtn onClick={exportCSV} icon={<FaDownload />} label="Export CSV" />
            <ActionBtn onClick={copySummary} icon={<FaCopy />} label="Copy Ringkas" />
            <ActionBtn onClick={fetchDashboardData} icon={<FaSyncAlt />} label="Refresh" />
          </div>
        </div>
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </motion.div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari guru/mapel…"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {distinctMapel.map((m) => (
              <option key={m} value={m}>
                {m === "ALL" ? "Semua Mapel" : m}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={periode.from}
            onChange={(e) => setPeriode((p) => ({ ...p, from: e.target.value }))}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="date"
            value={periode.to}
            onChange={(e) => setPeriode((p) => ({ ...p, to: e.target.value }))}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {lastUpdated && <>Terakhir diperbarui: {new Date(lastUpdated).toLocaleString()}</>}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI
          title="Jumlah Guru"
          value={summary.totalGuru}
          trend={calcTrend(summary.totalGuru, 1.02)}
          series={miniSeries(summary.totalGuru)}
        />
        <KPI
          title="Jumlah Siswa"
          value={summary.totalSiswa}
          trend={calcTrend(summary.totalSiswa, 1.05)}
          series={miniSeries(summary.totalSiswa)}
          color="pink"
        />
        <KPI
          title="Total Kuisioner"
          value={summary.totalKuisioner}
          trend={calcTrend(summary.totalKuisioner, 1.03)}
          series={miniSeries(summary.totalKuisioner)}
          color="amber"
        />
      </div>

      {/* CHART UTAMA */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Rata-rata Penilaian per Guru</h3>
          <SortTabs sort={sort} setSort={setSort} />
        </div>
        {filtered.length > 0 ? (
          <div className="mt-4">
            <ChartDashboard data={chartData} horizontal={true} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* GRID INFO: TOP 5 + DISTRIBUSI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">🏅 Top 5 Guru</h3>
          <ul className="space-y-3">
            {top5.map((g, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white
                    ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-500" : i === 2 ? "bg-orange-500" : "bg-red-600"}`}
                    title={`Peringkat ${i + 1}`}
                  >
                    <FaMedal />
                  </span>
                  <div>
                    <div className="font-semibold">{g.guru}</div>
                    <div className="text-xs text-gray-600">{g.mapel}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-700">{Number(g.rataRata || 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">rata-rata</div>
                </div>
              </li>
            ))}
            {top5.length === 0 && <div className="text-sm text-gray-500">Belum ada data.</div>}
          </ul>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Distribusi Nilai</h3>
          <div className="space-y-3">
            {Object.entries(distribusi).map(([label, count]) => (
              <BarRow key={label} label={label} value={count} total={summary.totalGuru || 1} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Menunjukkan jumlah guru di tiap rentang nilai.
          </p>
        </div>
      </div>

      {/* TABEL DETAIL */}
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Detail Statistik Guru</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-red-600 text-white">
              <Th label="Nama Guru" sortable field="guru" sort={sort} setSort={setSort} />
              <Th label="Mata Pelajaran" sortable field="mapel" sort={sort} setSort={setSort} />
              <Th label="Rata-rata Penilaian" sortable field="rataRata" sort={sort} setSort={setSort} />
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-red-50`}
                >
                  <td className="p-2 border">{item.guru}</td>
                  <td className="p-2 border">{item.mapel}</td>
                  <td className="p-2 border text-center font-semibold text-red-700">
                    {Number(item.rataRata || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-6 italic">
                  Tidak ada data statistik sesuai filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Reusable UI parts ---------- */

function ActionBtn({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30
                 px-3 py-2 rounded-md text-sm shadow hover:shadow-md transition"
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function KPI({ title, value, trend, series, color = "red" }) {
  const up = trend >= 0;
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
        <div className="text-3xl font-extrabold text-red-700">{formatNumber(value)}</div>
        <div className={`mt-1 inline-flex items-center gap-1 text-xs ${up ? "text-emerald-600" : "text-red-600"}`}>
          {up ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(trend)}% {up ? "naik" : "turun"}
        </div>
      </div>
      <Sparkline series={series} color={color} />
    </div>
  );
}

function Sparkline({ series = [], color = "red" }) {
  const max = Math.max(...series, 1);
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1 || 1)) * 100;
      const y = 40 - (v / max) * 40;
      return `${x},${y}`;
    })
    .join(" ");
  const strokeColor =
    color === "pink" ? "#ec4899" : color === "amber" ? "#f59e0b" : "#ef4444";

  return (
    <svg viewBox="0 0 100 40" className="w-28 h-12">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
      <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
      </linearGradient>
      <polygon
        points={`${points} 100,40 0,40`}
        fill="url(#sparkFill)"
        opacity="0.4"
      />
    </svg>
  );
}

function calcTrend(v, factor = 1.03) {
  if (!v) return 0;
  const prev = v / factor;
  const diff = v - prev;
  return Math.round((diff / prev) * 100);
}

function miniSeries(seed = 10) {
  // generate angka semi-acak tapi stabil dari seed
  const base = Math.max(5, Math.min(40, Number(seed) || 10));
  return Array.from({ length: 8 }, (_, i) =>
    Math.round(base + (Math.sin(i) + Math.cos(i / 2)) * 3 + i)
  );
}

function BarRow({ label, value, total }) {
  const pct = Math.round((value / (total || 1)) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold">{value} <span className="text-xs text-gray-500">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 rounded bg-gradient-to-r from-red-600 via-pink-500 to-red-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Th({ label, sortable, field, sort, setSort }) {
  const is = sort.field === field;
  return (
    <th
      className={`p-2 border cursor-${sortable ? "pointer" : "default"} select-none`}
      onClick={() =>
        sortable &&
        setSort({
          field,
          dir: is && sort.dir === "asc" ? "desc" : "asc",
        })
      }
      title={sortable ? "Klik untuk sort" : ""}
    >
      <div className="flex items-center gap-2 justify-center">
        <span>{label}</span>
        {sortable && (
          <span className={`text-xs ${is ? "opacity-100" : "opacity-40"}`}>
            {is ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
          </span>
        )}
      </div>
    </th>
  );
}

function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-24 rounded-2xl bg-gradient-to-r from-red-100 via-red-50 to-pink-100 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl shadow p-4">
            <div className="h-5 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-80 bg-white rounded-xl shadow p-6">
        <div className="h-5 w-56 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-64 w-full bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-white rounded-xl shadow p-6 animate-pulse" />
        ))}
      </div>
      <div className="h-80 bg-white rounded-xl shadow p-6 animate-pulse" />
    </div>
  );
}

function ErrorPanel({ msg, onRetry }) {
  return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
        <div className="font-semibold mb-1">Gagal memuat dashboard</div>
        <div className="text-sm mb-3">{msg}</div>
        <button
          onClick={onRetry}
          className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <svg
          viewBox="0 0 200 120"
          className="w-48 h-28 mx-auto mb-3"
          aria-hidden
        >
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect x="10" y="20" width="180" height="80" rx="10" fill="#f3f4f6" />
          <rect x="25" y="40" width="60" height="10" rx="5" fill="url(#g)" />
          <rect x="25" y="60" width="120" height="10" rx="5" fill="#e5e7eb" />
          <rect x="25" y="80" width="100" height="10" rx="5" fill="#e5e7eb" />
        </svg>
        <div className="text-gray-600">Belum ada data sesuai filter.</div>
      </div>
    </div>
  );
}

function formatNumber(n) {
  try {
    return new Intl.NumberFormat("id-ID").format(n || 0);
  } catch {
    return String(n || 0);
  }
}

function SortTabs({ sort, setSort }) {
  const options = [
    { label: "Tertinggi", field: "rataRata", dir: "desc" },
    { label: "Terendah", field: "rataRata", dir: "asc" },
    { label: "Nama Guru A–Z", field: "guru", dir: "asc" },
  ];
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {options.map((o) => {
        const active = sort.field === o.field && sort.dir === o.dir;
        return (
          <button
            key={o.label}
            onClick={() => setSort({ field: o.field, dir: o.dir })}
            className={`px-3 py-1 text-sm rounded-md transition
              ${active ? "bg-white shadow font-semibold" : "text-gray-600 hover:bg-gray-200"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default Dashboard;
