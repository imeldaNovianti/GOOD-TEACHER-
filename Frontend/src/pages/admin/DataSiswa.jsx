import { useEffect, useMemo, useRef, useState } from "react";
import {
  getSiswa,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../../api/adminApi"; // Mengimpor API untuk mendapatkan, membuat, memperbarui, dan menghapus data siswa
import Table from "../../components/common/Table"; // Mengimpor komponen tabel
import Button from "../../components/common/Button"; // Mengimpor komponen tombol
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUndo,
} from "react-icons/fa"; // Mengimpor ikon dari react-icons

const SORT_FIELDS = [
  { label: "Nama Lengkap", value: "namaLengkap" },
  { label: "NISN", value: "nisn" },
  { label: "Kelas", value: "kelas" },
]; // Menyusun array untuk opsi pengurutan berdasarkan nama lengkap, NISN, atau kelas

function DataSiswa() {
  // Inisialisasi state untuk data dan pagination
  const [rows, setRows] = useState([]); // Menyimpan data siswa yang akan ditampilkan dalam tabel
  const [totalElements, setTotalElements] = useState(0); // Menyimpan jumlah total elemen siswa untuk pagination

  const [page, setPage] = useState(0); // Menyimpan nomor halaman untuk pagination
  const [size, setSize] = useState(10); // Menyimpan jumlah data per halaman
  const [search, setSearch] = useState(""); // Menyimpan kata kunci pencarian
  const [sortBy, setSortBy] = useState("namaLengkap"); // Menyimpan kolom yang digunakan untuk pengurutan
  const [sortDir, setSortDir] = useState("asc"); // Menyimpan arah pengurutan (asc atau desc)

  const [editId, setEditId] = useState(null); // Menyimpan ID siswa yang sedang diedit

  // Inisialisasi form dengan nilai default kosong
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
  const [form, setForm] = useState(initialForm); // Menyimpan data form yang akan diedit atau ditambah
  const [errors, setErrors] = useState({}); // Menyimpan error validasi untuk form
  const debounceRef = useRef(null); // Referensi untuk debounce pencarian agar tidak mengirim request terlalu cepat

  const totalPages = useMemo(
    () => Math.ceil(totalElements / size) || 1,
    [totalElements, size]
  ); // Menghitung jumlah total halaman berdasarkan total elemen dan ukuran per halaman

  // Fungsi validasi form sebelum submit
  const validate = () => {
    const e = {}; // Objek untuk menyimpan error validasi
    if (!form.namaLengkap.trim()) e.namaLengkap = "Nama lengkap wajib diisi"; // Validasi nama lengkap
    if (!form.nisn.trim()) e.nisn = "NISN wajib diisi"; // Validasi NISN
    if (!form.kelas.trim()) e.kelas = "Kelas wajib diisi"; // Validasi kelas
    if (!editId && !form.password.trim()) // Validasi password hanya untuk tambah siswa
      e.password = "Password wajib diisi"; 
    setErrors(e); // Menyimpan error ke state
    return Object.keys(e).length === 0; // Mengembalikan true jika tidak ada error
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setForm(initialForm); // Mengembalikan form ke nilai default
    setErrors({}); // Menghapus error validasi
    setEditId(null); // Menghapus ID edit
  };

  // Fungsi untuk mengambil data siswa dari server
  const fetchData = async () => {
    const res = await getSiswa({ search, sortBy, sortDir, page, size });
    setRows(res.data.content || res.data || []); // Menyimpan data siswa ke dalam state
    setTotalElements(
      typeof res.data.totalElements === "number"
        ? res.data.totalElements
        : res.data.content
        ? res.data.content.length
        : 0
    ); // Menyimpan jumlah total elemen untuk pagination
  };

  // Efek samping untuk mengambil data saat terjadi perubahan pada pagination atau pencarian
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, size, sortBy, sortDir]);

  // Efek samping untuk menangani debounce pencarian
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current); // Membersihkan timeout sebelumnya
    debounceRef.current = setTimeout(() => {
      setPage(0); // Reset ke halaman pertama ketika pencarian berubah
      fetchData(); // Ambil data berdasarkan pencarian
    }, 400); // Delay 400ms sebelum mengirim request
    return () => clearTimeout(debounceRef.current); // Membersihkan timeout saat komponen unmount
    // eslint-disable-next-line
  }, [search]);

  // Fungsi untuk membuka form edit dan mengisi nilai form dengan data yang akan diedit
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
    setEditId(row.id); // Menyimpan ID siswa yang akan diedit
  };

  // Fungsi untuk menghapus siswa berdasarkan ID
  const onDelete = async (id) => {
    if (confirm("Yakin hapus siswa ini?")) { // Konfirmasi sebelum menghapus
      await deleteSiswa(id); // Menghapus data siswa
      if (rows.length === 1 && page > 0) { // Jika data yang ditampilkan hanya satu dan berada di halaman selain pertama
        setPage((p) => p - 1); // Kembali ke halaman sebelumnya
      } else {
        fetchData(); // Mengambil ulang data setelah penghapusan
      }
    }
  };

  // Fungsi untuk mengirim form (untuk tambah atau update siswa)
  const onSubmit = async (e) => {
    e.preventDefault(); // Mencegah form untuk melakukan submit secara default
    if (!validate()) return; // Validasi form sebelum lanjut
    const payload = { ...form }; // Menyusun data dari form
    if (!payload.password) delete payload.password; // Menghapus password jika kosong saat update

    if (editId) {
      await updateSiswa(editId, payload); // Update data siswa jika editId ada
    } else {
      await createSiswa(payload); // Tambah data siswa jika tidak ada editId
    }
    resetForm(); // Reset form setelah submit
    fetchData(); // Mengambil data siswa terbaru
  };

  return (
    <div className="space-y-8">
      {/* FORM SECTION */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-red-900 mb-4">
          {editId ? "Edit Siswa" : "Tambah Siswa"}
        </h2>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input fields untuk namaLengkap, nisn, kelas, email, noHp, alamat */}
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
          {/* Input fields untuk tglLahir, namaAyah, namaIbu */}
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

          {/* Password field only for adding new student */}
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
          {/* Jika tidak ada data */}
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
