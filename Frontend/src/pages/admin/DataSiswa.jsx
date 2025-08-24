import { useEffect, useMemo, useRef, useState } from "react";
import {
  getSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../../api/adminApi";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUndo,
} from "react-icons/fa";

const SORT_FIELDS = [
  { label: "Nama Lengkap", value: "namaLengkap" },
  { label: "NISN", value: "nisn" },
  { label: "Kelas", value: "kelas" },
];

function DataSiswa() {
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("namaLengkap");
  const [sortDir, setSortDir] = useState("asc");

  const [editId, setEditId] = useState(null);

  const initialForm = {
    namaLengkap: "",
    nisn: "",
    kelas: "",
    email: "",
    noHp: "",
    alamat: "",
    tglLahir: "",
    namaAyah: "",
    namaIbu: "",
    password: "",
  };
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);

  const totalPages = useMemo(
    () => Math.ceil(totalElements / size) || 1,
    [totalElements, size]
  );

  // validasi form
  const validate = () => {
    const e = {};
    if (!form.namaLengkap.trim()) e.namaLengkap = "Nama lengkap wajib diisi";
    if (!form.nisn.trim()) e.nisn = "NISN wajib diisi";
    if (!form.kelas.trim()) e.kelas = "Kelas wajib diisi";
    if (!editId && !form.password.trim())
      e.password = "Password wajib diisi"; // hanya wajib saat create
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditId(null);
  };

  // fetch data
  const fetchData = async () => {
    const res = await getSiswa({ search, sortBy, sortDir, page, size });
    setRows(res.data.content || res.data || []);
    setTotalElements(
      typeof res.data.totalElements === "number"
        ? res.data.totalElements
        : res.data.content
        ? res.data.content.length
        : 0
    );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchData();
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [search]);

  // edit
  const openEdit = (row) => {
    setForm({
      namaLengkap: row.namaLengkap || "",
      nisn: row.nisn || "",
      kelas: row.kelas || "",
      email: row.email || "",
      noHp: row.noHp || "",
      alamat: row.alamat || "",
      tglLahir: row.tglLahir ? row.tglLahir.split("T")[0] : "",
      namaAyah: row.namaAyah || "",
      namaIbu: row.namaIbu || "",
      password: "",
    });
    setEditId(row.id);
  };

  // delete
  const onDelete = async (id) => {
    if (confirm("Yakin hapus siswa ini?")) {
      await deleteSiswa(id);
      if (rows.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchData();
      }
    }
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (!payload.password) delete payload.password;

    if (editId) {
      await updateSiswa(editId, payload);
    } else {
      await createSiswa(payload);
    }
    resetForm();
    fetchData();
  };

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-red-900 mb-4">
          {editId ? "Edit Siswa" : "Tambah Siswa"}
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["namaLengkap", "nisn", "kelas", "email", "noHp", "alamat"].map(
            (field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-semibold capitalize mb-1">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field] || ""}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, [field]: e.target.value }))
                  }
                  className={`border rounded-md p-2 focus:ring-2 focus:ring-red-300 ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm">{errors[field]}</p>
                )}
              </div>
            )
          )}

          <div>
            <label className="text-sm font-semibold">Tanggal Lahir</label>
            <input
              type="date"
              value={form.tglLahir || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, tglLahir: e.target.value }))
              }
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Nama Ayah</label>
            <input
              type="text"
              value={form.namaAyah || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, namaAyah: e.target.value }))
              }
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Nama Ibu</label>
            <input
              type="text"
              value={form.namaIbu || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, namaIbu: e.target.value }))
              }
              className="border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300"
            />
          </div>

          {!editId && (
            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>
          )}
        </form>

        <div className="mt-5 flex gap-3">
          <Button
            onClick={onSubmit}
            className="!bg-red-900 hover:!bg-red-800"
          >
            {editId ? "Update" : "Simpan"}
          </Button>
          {editId && (
            <Button
              onClick={resetForm}
              className="!bg-gray-300 !text-gray-700 hover:!bg-gray-400 flex items-center gap-2"
            >
              <FaUndo /> Batal Edit
            </Button>
          )}
        </div>
      </div>

      {/* SEARCH + SORT + PAGE SIZE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow border border-gray-200">
          <FaSearch className="opacity-60" />
          <input
            type="text"
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none px-2 py-1 bg-transparent w-56"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(0);
            }}
            className="border rounded-md px-3 py-2 bg-white"
          >
            {SORT_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                Urutkan: {f.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-900 text-white hover:bg-red-800 transition"
          >
            {sortDir === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
            {sortDir.toUpperCase()}
          </button>

          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded-md px-3 py-2 bg-white"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / halaman
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table
          headers={[
            "Nama Lengkap",
            "NISN",
            "Kelas",
            "Email",
            "No HP",
            "Alamat",
            "Tgl Lahir",
            "Orang Tua",
            "Aksi",
          ]}
        >
          {rows.map((s) => (
            <tr
              key={s.id}
              className="hover:bg-red-50 transition-colors duration-200"
            >
              <td className="border-t px-4 py-3 font-medium">
                {s.namaLengkap}
              </td>
              <td className="border-t px-4 py-3">{s.nisn}</td>
              <td className="border-t px-4 py-3">{s.kelas}</td>
              <td className="border-t px-4 py-3">{s.email}</td>
              <td className="border-t px-4 py-3">{s.noHp}</td>
              <td className="border-t px-4 py-3">{s.alamat}</td>
              <td className="border-t px-4 py-3">
                {s.tglLahir ? new Date(s.tglLahir).toLocaleDateString() : "-"}
              </td>
              <td className="border-t px-4 py-3">
                {s.namaAyah || "-"} / {s.namaIbu || "-"}
              </td>
              <td className="border-t px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => openEdit(s)}
                    className="!bg-yellow-500 hover:!bg-yellow-600 flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(s.id)}
                    className="!bg-red-600 hover:!bg-red-700 flex items-center gap-2"
                  >
                    <FaTrash /> Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Menampilkan{" "}
          <span className="font-semibold">
            {rows.length > 0 ? page * size + 1 : 0}–{page * size + rows.length}
          </span>{" "}
          dari <span className="font-semibold">{totalElements}</span> data
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300 disabled:opacity-50"
          >
            « First
          </Button>
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300 disabled:opacity-50"
          >
            ‹ Prev
          </Button>
          <span className="px-3 py-2 rounded bg-white border">
            Hal <b>{page + 1}</b> / {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300 disabled:opacity-50"
          >
            Next ›
          </Button>
          <Button
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
            className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300 disabled:opacity-50"
          >
            Last »
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataSiswa;
