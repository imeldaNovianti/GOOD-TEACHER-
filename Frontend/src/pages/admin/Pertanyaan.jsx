import { useEffect, useRef, useState, useMemo } from "react";
import {
  getPertanyaan,
  createPertanyaan,
  updatePertanyaan,
  deletePertanyaan,
} from "../../api/adminApi";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSortAmountUp,
  FaSortAmountDown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function Pertanyaan() {
  const [rows, setRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ teks: "", tipeJawaban: "SKALA" });
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);

  const totalPages = useMemo(
    () => Math.ceil(totalElements / size) || 1,
    [totalElements, size]
  );

  const validate = () => {
    const e = {};
    if (!form.teks.trim()) e.teks = "Pertanyaan wajib diisi";
    if (!form.tipeJawaban) e.tipeJawaban = "Tipe jawaban wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm({ teks: "", tipeJawaban: "SKALA" });
    setErrors({});
    setEditId(null);
  };

  const fetchData = async () => {
    const res = await getPertanyaan({ search, sortBy, sortDir, page, size });
    setRows(res.data.content || res.data || []);
    setTotalElements(res.data.totalElements ?? res.data.length ?? 0);
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

  const onSubmit = async () => {
    if (!validate()) return;
    if (editId) {
      await updatePertanyaan(editId, form);
    } else {
      await createPertanyaan(form);
    }
    resetForm();
    fetchData();
  };

  const onDelete = async (id) => {
    if (confirm("Yakin hapus pertanyaan ini?")) {
      await deletePertanyaan(id);
      if (rows.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        fetchData();
      }
    }
  };

  const openEdit = (row) => {
    setForm({ teks: row.teks, tipeJawaban: row.tipeJawaban });
    setEditId(row.id);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  return (
    <div className="space-y-8">
      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold text-red-900 mb-4">
          {editId ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
        </h2>

        <div className="space-y-4">
          {/* Teks Pertanyaan */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Teks Pertanyaan
            </label>
            <textarea
              placeholder="Masukkan pertanyaan..."
              value={form.teks}
              onChange={(e) =>
                setForm((s) => ({ ...s, teks: e.target.value }))
              }
              className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300 ${
                errors.teks ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.teks && (
              <p className="text-red-600 text-sm mt-1">{errors.teks}</p>
            )}
          </div>

          {/* Tipe Jawaban */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Tipe Jawaban
            </label>
            <select
              value={form.tipeJawaban}
              onChange={(e) =>
                setForm((s) => ({ ...s, tipeJawaban: e.target.value }))
              }
              className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-red-300 ${
                errors.tipeJawaban ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="SKALA">Skala (1–5)</option>
              <option value="TEKS">Teks</option>
            </select>
            {errors.tipeJawaban && (
              <p className="text-red-600 text-sm mt-1">
                {errors.tipeJawaban}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          {editId && (
            <Button
              onClick={resetForm}
              className="!bg-gray-200 !text-gray-800 hover:!bg-gray-300 flex items-center gap-2"
            >
              <FaTimes /> Batal
            </Button>
          )}
          <Button
            onClick={onSubmit}
            className="!bg-red-900 hover:!bg-red-800 flex items-center gap-2"
          >
            {editId ? "Update" : <><FaPlus /> Simpan</>}
          </Button>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow border">
          <FaSearch className="opacity-60" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none px-2 py-1 bg-transparent w-56"
          />
        </div>

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

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table
          headers={[
            <div
              key="h1"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSort("teks")}
            >
              Pertanyaan{" "}
              {sortBy === "teks" ? (
                sortDir === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                )
              ) : null}
            </div>,
            <div
              key="h2"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggleSort("tipeJawaban")}
            >
              Tipe Jawaban{" "}
              {sortBy === "tipeJawaban" ? (
                sortDir === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                )
              ) : null}
            </div>,
            "Aksi",
          ]}
        >
          {rows.map((q) => (
            <tr key={q.id} className="hover:bg-red-50 transition-colors">
              <td className="border-t px-4 py-3">{q.teks}</td>
              <td className="border-t px-4 py-3">{q.tipeJawaban}</td>
              <td className="border-t px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEdit(q)}
                    className="!bg-yellow-500 hover:!bg-yellow-600 flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(q.id)}
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
              <td
                colSpan={3}
                className="px-4 py-8 text-center text-gray-500"
              >
                Tidak ada pertanyaan.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Menampilkan{" "}
          <span className="font-semibold">
            {rows.length > 0 ? page * size + 1 : 0}–
            {page * size + rows.length}
          </span>{" "}
          dari <span className="font-semibold">{totalElements}</span>{" "}
          pertanyaan
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
            Hal {page + 1} / {totalPages}
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

export default Pertanyaan;
