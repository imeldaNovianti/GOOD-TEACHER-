import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "../../components/common/Button"; // Komponen tombol reusable
import Table from "../../components/common/Table"; // Komponen tabel reusable
import {
  getPeriode,
  createPeriode,
  updatePeriode,
  deletePeriode,
} from "../../api/adminApi"; // API untuk CRUD periode

function Periode() {
  // State untuk data periode
  const [rows, setRows] = useState([]);
  
  // State untuk form tambah/edit periode
  const [form, setForm] = useState({
    nama: "",
    mulai: "",
    selesai: "",
    status: "TIDAK_AKTIF",
  });

  // State untuk menandai periode yang sedang diedit
  const [editId, setEditId] = useState(null);

  // Fungsi untuk load semua data periode dari API
  const loadData = async () => {
    const res = await getPeriode(); // Ambil data dari backend
    setRows(res.data); // Simpan ke state rows
  };

  // Jalankan loadData saat komponen mount
  useEffect(() => {
    loadData();
  }, []);

  // Reset form ke default dan hapus editId
  const resetForm = () => {
    setForm({ nama: "", mulai: "", selesai: "", status: "TIDAK_AKTIF" });
    setEditId(null);
  };

  // Submit form untuk tambah atau update periode
  const onSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updatePeriode(editId, form); // Update jika ada editId
    } else {
      await createPeriode(form); // Tambah data baru
    }
    resetForm();
    loadData(); // Reload data setelah submit
  };

  // Set form untuk edit data tertentu
  const onEdit = (row) => {
    setForm({
      nama: row.nama,
      mulai: row.mulai,
      selesai: row.selesai,
      status: row.status,
    });
    setEditId(row.id);
  };

  // Hapus periode tertentu
  const onDelete = async (id) => {
    if (confirm("Yakin hapus data ini?")) {
      await deletePeriode(id);
      loadData(); // Reload data setelah hapus
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Periode Kuisioner</h2>

      {/* Form tambah/edit periode */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-5 shadow rounded-lg border space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Nama Periode */}
          <div>
            <label className="block font-semibold mb-1">Nama Periode</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Input Tanggal Mulai */}
          <div>
            <label className="block font-semibold mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={form.mulai}
              onChange={(e) => setForm({ ...form, mulai: e.target.value })}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Input Tanggal Selesai */}
          <div>
            <label className="block font-semibold mb-1">Tanggal Selesai</label>
            <input
              type="date"
              value={form.selesai}
              onChange={(e) => setForm({ ...form, selesai: e.target.value })}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          {/* Input Status */}
          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border rounded-md p-2 w-full"
            >
              <option value="AKTIF">AKTIF</option>
              <option value="TIDAK_AKTIF">TIDAK AKTIF</option>
            </select>
          </div>
        </div>

        {/* Tombol Submit dan Batal */}
        <div className="flex gap-3">
          <Button type="submit" className="!bg-red-900 hover:!bg-red-800">
            {editId ? "Update" : "Simpan"}
          </Button>
          {editId && (
            <Button
              type="button"
              onClick={resetForm}
              className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      {/* Table data periode */}
      <div className="bg-white shadow rounded-lg border overflow-hidden">
        <Table headers={["Nama", "Mulai", "Selesai", "Status", "Aksi"]}>
          {rows.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-red-50 transition-colors duration-200"
            >
              <td className="border-t px-4 py-2">{p.nama}</td>
              <td className="border-t px-4 py-2">{p.mulai}</td>
              <td className="border-t px-4 py-2">{p.selesai}</td>
              <td className="border-t px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    p.status === "AKTIF"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="border-t px-4 py-2 flex gap-2">
                <Button
                  onClick={() => onEdit(p)}
                  className="!bg-yellow-500 hover:!bg-yellow-600 flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  onClick={() => onDelete(p.id)}
                  className="!bg-red-600 hover:!bg-red-700 flex items-center gap-2"
                >
                  <FaTrash /> Hapus
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default Periode;
