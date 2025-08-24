import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ganti sesuai backend kamu
});

// ==================== GURU MAPEL ====================
export const getGuru = async ({
  search = "",
  sortBy = "namaGuru",
  sortDir = "asc",
  page = 0,
  size = 10,
} = {}) => {
  const params = { search, sortBy, sortDir, page, size };
  return api.get("/guru-mapel", { params });
};

export const createGuru = (payload) => api.post("/guru-mapel", payload);
export const updateGuru = (id, payload) => api.put(`/guru-mapel/${id}`, payload);
export const deleteGuru = (id) => api.delete(`/guru-mapel/${id}`);


// ==================== SISWA / USER ====================
export const getSiswa = async ({
  search = "",
  sortBy = "namaLengkap",
  sortDir = "asc",
  page = 0,
  size = 10,
} = {}) => {
  const params = { search, sortBy, sortDir, page, size };
  return api.get("/users", { params });
};

export const createSiswa = (payload) => api.post("/users", payload);
export const updateSiswa = (id, payload) => api.put(`/users/${id}`, payload);
export const deleteSiswa = (id) => api.delete(`/users/${id}`);


// ==================== PERTANYAAN ====================
export const getPertanyaan = async ({
  search = "",
  sortBy = "id",
  sortDir = "asc",
  page = 0,
  size = 10,
} = {}) => {
  const params = { search, sortBy, sortDir, page, size };
  return api.get("/pertanyaan", { params });
};

export const createPertanyaan = (payload) => api.post("/pertanyaan", payload);
export const updatePertanyaan = (id, payload) => api.put(`/pertanyaan/${id}`, payload);
export const deletePertanyaan = (id) => api.delete(`/pertanyaan/${id}`);


// ==================== PERIODE KUISIONER ====================
export const getPeriode = async ({
  search = "",
  sortBy = "mulai",
  sortDir = "asc",
  page = 0,
  size = 10,
} = {}) => {
  const params = { search, sortBy, sortDir, page, size };
return api.get("/periode-kuisioner", { params });
};

export const createPeriode = (payload) => api.post("/periode", payload);
export const updatePeriode = (id, payload) => api.put(`/periode/${id}`, payload);
export const deletePeriode = (id) => api.delete(`/periode/${id}`);


// ==================== OPSIONAL: LOGIN/LOGOUT ====================
export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);

// contoh kalau butuh token interceptor:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
