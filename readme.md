Aplikasi ini adalah platform evaluasi kinerja guru yang memungkinkan siswa untuk memberikan penilaian (kuisioner) kepada guru/dosen secara online.
Data yang dikumpulkan bisa dipakai oleh pihak kesiswaan (atau BK) untuk melihat performa guru, rekap hasil kuisioner, serta laporan skor kinerja.

🔑 Aktor utama dalam sistem:

Siswa (Mahasiswa)

Bisa login ke sistem.

Mengisi kuisioner untuk menilai guru pada mata pelajaran tertentu.

Melihat hasil penilaian yang pernah diisi.
Mencetak tiket bukti pengisian dalam bentuk PDF.
Mengelola akun (update profil, password).
Kesiswaan / BK (Admin)
Login sebagai admin.
Mengelola data master (CRUD):
Data Siswa
Data Guru
Data Pertanyaan Kuisioner
Melihat hasil kuisioner yang sudah diisi siswa.
mendownloadd hasil laporan

Melihat dan mengunduh rekapan skor kinerja guru dalam bentuk laporan.

📌 Alur Sistem

Login

Siswa dan admin login dengan akun masing-masing (role-based access).

Bagi Siswa:

Setelah login → pilih mata pelajaran/guru → isi kuisioner.

Submit hasil kuisioner → sistem simpan ke database.

Bisa lihat riwayat kuisioner yang pernah diisi.

Bisa unduh bukti pengisian dalam PDF.

Bagi Admin (Kesiswaan):

Login sebagai admin.

Kelola data master (CRUD siswa, guru, fakultas, jurusan, pertanyaan, mapel).

Lihat data kuisioner yang sudah masuk.

Buat laporan hasil penilaian → unduh dalam bentuk rekapan PDF.

📌 Fitur Utama
🔹 Fitur untuk Admin (Kesiswaan / BK)

Manajemen Master Data (CRUD):

Siswa

Guru

Fakultas

Jurusan

Pertanyaan Kuisioner

Mata Pelajaran

Manajemen Data Pengajaran:

Relasi guru ↔ mata pelajaran ↔ jurusan/fakultas.

Monitoring Kuisioner:

Melihat hasil kuisioner tiap guru.

Melihat laporan skor per mata pelajaran.

Unduh laporan dalam format PDF.

🔹 Fitur untuk Siswa

Manajemen Akun (CRUD):

Edit profil (nama, jurusan, password).

Pengisian Kuisioner:

Pilih mata pelajaran & guru → isi pertanyaan → submit.

Validasi agar 1 siswa hanya bisa mengisi 1x per mata pelajaran/guru.

Lihat Hasil Kuisioner:

Bisa cek kembali hasil yang pernah diisi.

Cetak Bukti Pengisian:

Download bukti pengisian dalam bentuk PDF tiket (misal: tanda bukti wajib untuk daftar ujian).

📌 Output Sistem

Admin → Laporan penilaian kinerja guru (rekap per guru, per mata pelajaran, per fakultas/jurusan).

Siswa → Tiket bukti pengisian kuisioner dalam bentuk PDF.

Database → Menyimpan seluruh data master + hasil kuisioner (bisa dipakai untuk analisis lebih lanjut).

Kalau aku sederhanakan, sistemmu ini punya 3 kategori fitur:

Data Master (Admin CRUD)

Kuisioner (Siswa Isi & Admin Rekap)

Laporan (PDF untuk admin & tiket siswa)