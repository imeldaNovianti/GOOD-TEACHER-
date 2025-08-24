import { useEffect, useMemo, useRef, useState } from "react";
import {
  getGuru,
  createGuru,
  updateGuru,
  deleteGuru,
} from "../../api/adminApi";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const SORT_FIELDS = [
  { label: "Nama Guru", value: "namaGuru" },
  { label: "Mata Pelajaran", value: "mataPelajaran" },
];

function DataGuru() {
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("namaGuru");
  const [sortDir, setSortDir] = useState("asc");

  // form state
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ namaGuru: "", mataPelajaran: "" });
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);

  const totalPages = useMemo(
    () => Math.ceil(totalElements / size) || 1,
    [totalElements, size]
  );

  const validate = () => {
    const e = {};
    if (!form.namaGuru?.trim()) e.namaGuru = "Nama guru wajib diisi";
    if (!form.mataPelajaran?.trim())
      e.mataPelajaran = "Mata pelajaran wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm({ namaGuru: "", mataPelajaran: "" });
    setErrors({});
    setEditId(null);
  };

  const fetchData = async () => {
    const res = await getGuru({ search, sortBy, sortDir, page, size });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchData();
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onEdit = (row) => {
    setForm({ namaGuru: row.namaGuru, mataPelajaran: row.mataPelajaran });
    setEditId(row.id);
  };

  const onDelete = async (id) => {
    if (confirm("Yakin hapus data ini?")) {
      await deleteGuru(id);
      if (rows.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchData();
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId) {
      await updateGuru(editId, form);
    } else {
      await createGuru(form);
    }
    resetForm();
    fetchData();
  };

  const toggleSortByHeader = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Form tambah/edit */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow p-5 border border-gray-200 space-y-4"
      >
        <h3 className="text-lg font-bold text-red-900">
          {editId ? "Edit Guru" : "Tambah Guru"}
        </h3>

        <div>
          <label className="block text-sm font-semibold mb-1">Nama Guru</label>
          <input
            type="text"
            placeholder="Contoh: Ibu Sari"
            value={form.namaGuru}
            onChange={(e) =>
              setForm((s) => ({ ...s, namaGuru: e.target.value }))
            }
            className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-300 ${
              errors.namaGuru ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.namaGuru && (
            <p className="text-red-600 text-sm mt-1">{errors.namaGuru}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Mata Pelajaran
          </label>
          <input
            type="text"
            placeholder="Contoh: Bahasa Inggris"
            value={form.mataPelajaran}
            onChange={(e) =>
              setForm((s) => ({ ...s, mataPelajaran: e.target.value }))
            }
            className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-red-300 ${
              errors.mataPelajaran ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.mataPelajaran && (
            <p className="text-red-600 text-sm mt-1">
              {errors.mataPelajaran}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="!bg-red-900 hover:!bg-red-800 px-5"
          >
            {editId ? "Update" : "Simpan"}
          </Button>
          {editId && (
            <Button
              type="button"
              onClick={resetForm}
              className="!bg-gray-200 !text-gray-800 hover:!bg-gray-300 px-5"
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      {/* Search & filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center bg-white rounded-full px-3 py-1 shadow border border-gray-200">
            <FaSearch className="opacity-60" />
            <input
              type="text"
              placeholder="Cari nama guru / mapel..."
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
              title={`Arah: ${sortDir.toUpperCase()}`}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <Table headers={["Nama Guru", "Mata Pelajaran", "Aksi"]}>
          {rows.map((g) => (
            <tr
              key={g.id}
              className="hover:bg-red-50 transition-colors duration-200"
            >
              <td className="border-t px-4 py-3 font-medium">{g.namaGuru}</td>
              <td className="border-t px-4 py-3">{g.mataPelajaran}</td>
              <td className="border-t px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onEdit(g)}
                    className="!bg-yellow-500 hover:!bg-yellow-600 flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(g.id)}
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
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* Pagination */}
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
            Halaman <b>{page + 1}</b> / {totalPages}
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

export default DataGuru;
