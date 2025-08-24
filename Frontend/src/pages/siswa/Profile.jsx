import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCalendar,
  FaSave,
  FaEdit,
  FaIdCard,
  FaChalkboardTeacher,
} from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const userId = 1; // 👉 sementara hardcode, nanti dari auth/login

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditUser(data);
        setIsEditing(false);
        alert("✅ Profil berhasil diperbarui!");
      })
      .catch((err) => console.error("❌ Gagal update", err));
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
        {/* Kiri: Panel info siswa */}
        <div className="md:w-1/3 bg-red-800 text-white flex flex-col items-center justify-center p-6 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <div className="bg-white text-red-800 rounded-full p-6 mb-4">
            <FaUser size={60} />
          </div>
          <h3 className="text-xl font-bold mb-2">{user.namaLengkap}</h3>
          <p className="text-sm mb-1 flex items-center gap-2">
            <FaIdCard /> {user.nisn || "-"}
          </p>
          <p className="text-sm flex items-center gap-2">
            <FaChalkboardTeacher /> {user.kelas || "-"}
          </p>
        </div>

        {/* Kanan: Data detail */}
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-800">
            Profil Siswa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium flex items-center gap-1">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                value={editUser.email || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium flex items-center gap-1">
                <FaPhone /> No HP
              </label>
              <input
                type="text"
                name="noHp"
                value={editUser.noHp || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium flex items-center gap-1">
                <FaCalendar /> Tanggal Lahir
              </label>
              <input
                type="date"
                name="tglLahir"
                value={editUser.tglLahir || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>

            {/* Username (read-only) */}
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={editUser.username || ""}
                readOnly
                className="mt-1 w-full border rounded-md p-2 bg-gray-100"
              />
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium flex items-center gap-1">
                <FaHome /> Alamat
              </label>
              <textarea
                name="alamat"
                value={editUser.alamat || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>

            {/* Nama Orang Tua */}
            <div>
              <label className="block text-sm font-medium">Nama Ayah</label>
              <input
                type="text"
                name="namaAyah"
                value={editUser.namaAyah || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nama Ibu</label>
              <input
                type="text"
                name="namaIbu"
                value={editUser.namaIbu || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 w-full border rounded-md p-2 ${
                  !isEditing && "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-6 flex justify-end gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
              >
                <FaEdit /> Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditUser(user);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md"
                >
                  <FaSave /> Simpan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
