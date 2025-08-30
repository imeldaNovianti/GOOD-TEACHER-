// Import library axios untuk HTTP request
import axios from "axios";

// Membuat instance axios dengan baseURL default
const api = axios.create({
  baseURL: "http://localhost:8080/api", // alamat backend utama
});

// ==================== GURU MAPEL ====================

// Fungsi GET daftar guru-mapel dengan opsi pencarian, sorting, dan pagination
export const getGuru = async ({
  search = "", // default pencarian kosong
  sortBy = "namaGuru", // urutkan berdasarkan namaGuru
  sortDir = "asc", // arah sort default ascending
  page = 0, // halaman default 0
  size = 10, // jumlah data per halaman default 10
} = {}) => {
  const params = { search, sortBy, sortDir, page, size }; // parameter query
  return api.get("/guru-mapel", { params }); // panggil endpoint GET guru-mapel
};

// Fungsi POST untuk tambah guru
export const createGuru = (payload) => api.post("/guru-mapel", payload);

// Fungsi PUT untuk update guru berdasarkan id
export const updateGuru = (id, payload) => api.put(`/guru-mapel/${id}`, payload);

// Fungsi DELETE untuk hapus guru berdasarkan id
export const deleteGuru = (id) => api.delete(`/guru-mapel/${id}`);


// ==================== SISWA / USER ====================

// Fungsi GET daftar siswa/user dengan filter, sort, pagination
export const getSiswa = async ({
  search = "", // default pencarian kosong
  sortBy = "namaLengkap", // sort berdasarkan nama lengkap
  sortDir = "asc", // arah sort ascending
  page = 0, // halaman default
  size = 10, // jumlah data per halaman
} = {}) => {
  const params = { search, sortBy, sortDir, page, size }; // parameter query
  return api.get("/users", { params }); // request ke endpoint users
};

// Fungsi POST untuk tambah siswa
export const createSiswa = (payload) => api.post("/users", payload);

// Fungsi PUT untuk update data siswa
export const updateSiswa = (id, payload) => api.put(`/users/${id}`, payload);

// Fungsi DELETE untuk hapus siswa
export const deleteSiswa = (id) => api.delete(`/users/${id}`);


// ==================== PERTANYAAN ====================

// Fungsi GET daftar pertanyaan kuisioner dengan opsi sort, filter, pagination
export const getPertanyaan = async ({
  search = "", // default pencarian kosong
  sortBy = "id", // sort default berdasarkan id
  sortDir = "asc", // arah sort ascending
  page = 0, // halaman default
  size = 10, // jumlah data per halaman
} = {}) => {
  const params = { search, sortBy, sortDir, page, size }; // parameter query
  return api.get("/pertanyaan", { params }); // request ke endpoint pertanyaan
};

// Fungsi POST untuk tambah pertanyaan
export const createPertanyaan = (payload) => api.post("/pertanyaan", payload);

// Fungsi PUT untuk update pertanyaan
export const updatePertanyaan = (id, payload) => api.put(`/pertanyaan/${id}`, payload);

// Fungsi DELETE untuk hapus pertanyaan
export const deletePertanyaan = (id) => api.delete(`/pertanyaan/${id}`);


// ==================== PERIODE KUISIONER ====================

// Fungsi GET daftar periode kuisioner
export const getPeriode = async ({
  search = "", // filter pencarian
  sortBy = "mulai", // default sort berdasarkan tanggal mulai
  sortDir = "asc", // ascending
  page = 0, // halaman default
  size = 10, // jumlah per halaman
} = {}) => {
  const params = { search, sortBy, sortDir, page, size }; // parameter query
  return api.get("/periode-kuisioner", { params }); // request ke endpoint periode-kuisioner
};

// Fungsi POST untuk tambah periode kuisioner
export const createPeriode = (payload) => api.post("/periode-kuisioner", payload);

// Fungsi PUT untuk update periode kuisioner berdasarkan id
export const updatePeriode = (id, payload) =>
  api.put(`/periode-kuisioner/${id}`, payload);

// Fungsi DELETE untuk hapus periode kuisioner
export const deletePeriode = (id) =>
  api.delete(`/periode-kuisioner/${id}`);


// ==================== OPSIONAL: LOGIN/LOGOUT ====================

// Fungsi POST login
export const login = (payload) => api.post("/auth/login", payload);

// Fungsi POST register
export const register = (payload) => api.post("/auth/register", payload);

// Tambahkan interceptor agar setiap request otomatis kirim token Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // set header Authorization
  }
  return config; // kembalikan config yang sudah dimodifikasi
});
