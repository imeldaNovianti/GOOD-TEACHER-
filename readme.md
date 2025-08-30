# Sistem Penilaian Kinerja Guru oleh Siswa

## Deskripsi
Aplikasi ini dibuat untuk mempermudah proses penilaian kinerja guru oleh siswa secara digital. Siswa dapat mengisi kuisioner mengenai guru dan mata pelajaran tertentu, sementara admin dapat mengelola data guru, siswa, pertanyaan kuisioner, periode penilaian, serta melihat laporan dan analisis data. Aplikasi ini dirancang dengan UI modern, animasi interaktif, dan fitur lengkap untuk mendukung transparansi dan evaluasi akademik yang efektif.

Aplikasi ini mendukung:
- Dashboard interaktif dengan chart dan ringkasan statistik.
- Export laporan ke PDF atau Excel.
- Sistem login untuk admin dan siswa dengan hak akses berbeda.
- Animasi UI/UX menggunakan Framer Motion dan Tailwind CSS.

---

## Fitur-Fitur

### 1. Dashboard Admin
- Ringkasan statistik jumlah guru, siswa, dan kuisioner yang sudah diisi.
- Chart interaktif rata-rata penilaian per guru.
- Tabel detail statistik guru dengan sorting dan pagination.
- Export laporan ke PDF atau Excel.
- Highlight guru terbaik berdasarkan penilaian.

### 2. Manajemen Guru
- Tambah, edit, hapus data guru.
- Filter, pencarian, dan sorting berdasarkan nama guru atau mata pelajaran.
- Pagination untuk data guru banyak.
- Feedback langsung terhadap guru.

### 3. Manajemen Siswa
- Tambah, edit, hapus data siswa.
- Import data siswa dari file CSV (opsional).
- Filter dan pencarian berdasarkan nama atau NISN.
- Tampilkan detail profil siswa.

### 4. Manajemen Kuisioner
- Tambah, edit, hapus pertanyaan kuisioner.
- Kelola periode penilaian (semester atau tahun ajaran).
- Pilihan pertanyaan untuk tiap guru dan mata pelajaran.
- Hasil kuisioner dapat dianalisis per periode.

### 5. Penilaian oleh Siswa
- Login siswa menggunakan akun masing-masing.
- Mengisi kuisioner untuk guru sesuai kelas dan mata pelajaran.
- Memberikan feedback tambahan berupa saran atau komentar.
- Melihat hasil rata-rata penilaian setelah submit.

### 6. Laporan & Analisis
- Laporan lengkap dalam bentuk tabel dan grafik.
- Export laporan ke PDF (menggunakan OpenPDF) dan Excel.
- Filter laporan berdasarkan guru, periode, atau mata pelajaran.
- Visualisasi data interaktif (bar chart, pie chart).

### 7. UI/UX & Interaktivitas
- Sidebar collapsible untuk admin.
- Animasi smooth pada menu, tombol, dan chart.
- Gradient background, hover effect, shadow, dan efek blur.
- Dashboard modern dan responsif untuk desktop maupun mobile.

### 8. Sistem Login & Security
- Login untuk admin dan siswa dengan hak akses berbeda.
- Logout aman dan proteksi halaman admin.
- Validasi input dan sanitasi data untuk keamanan.

---

## Struktur Sidebar & Header

### Admin Sidebar
- Dashboard
- Data Guru
- Data Siswa
- Pertanyaan
- Periode
- Kuisioner
- Laporan
- Feedback
- About
- Logout  

**Fitur:** Collapsible, animasi scale & highlight menu aktif, tombol logout dengan animasi.

### Siswa Header
- Home
- Isi Kuisioner
- Hasil
- Profile
- Voice & Card (Achievement)
- About
- Logout  

**Fitur:** Gradient background, blur efek, animasi hover, indikator menu aktif.


## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.x
- Spring Data JPA
- Spring Security
- MySQL / MariaDB
- OpenPDF (export PDF)
- Lombok

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animasi)
- React Router DOM (routing)
- React Icons
- Axios (HTTP request)

### Tools & Lainnya
- Git & GitHub
- Node.js & npm/yarn
- Postman (testing API)
- VSCode / IDE favorit

---

## Cara Menjalankan Project

### Backend
1. Clone repository:
```bash
git clone <URL_REPO>
cd backend

Catatan

Admin dapat mengelola seluruh data dan melihat laporan.

Siswa hanya dapat mengisi kuisioner dan melihat hasil penilaian.

Semua data laporan dapat diexport ke PDF atau Excel.

Desain UI modern dengan animasi interaktif membuat aplikasi lebih menarik dan user-friendly.