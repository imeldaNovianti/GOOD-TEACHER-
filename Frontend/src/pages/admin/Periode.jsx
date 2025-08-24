import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import {
  getPeriode,
  createPeriode,
  updatePeriode,
  deletePeriode,
} from "../../api/adminApi"; // <- bikin di api

function Periode() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    mulai: "",
    selesai: "",
    status: "TIDAK_AKTIF",
  });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await getPeriode();
    setRows(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ nama: "", mulai: "", selesai: "", status: "TIDAK_AKTIF" });
    setEditId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updatePeriode(editId, form);
    } else {
      await createPeriode(form);
    }
    resetForm();
    loadData();
  };

  const onEdit = (row) => {
    setForm({
      nama: row.nama,
      mulai: row.mulai,
      selesai: row.selesai,
      status: row.status,
    });
    setEditId(row.id);
  };

  const onDelete = async (id) => {
    if (confirm("Yakin hapus data ini?")) {
      await deletePeriode(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Periode Kuisioner</h2>

      {/* Form tambah/edit */}
      <form
        onSubmit={onSubmit}
        className="bg-white p-5 shadow rounded-lg border space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Table */}
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
