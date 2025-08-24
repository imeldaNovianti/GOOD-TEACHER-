// Simpan data user ke localStorage setelah login
export const loginUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

// Hapus data user saat logout
export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Ambil data user dari localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Cek apakah user sudah login
export const isLoggedIn = () => {
  return getUser() !== null;
};

// Ambil role user (ADMIN / SISWA)
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};
