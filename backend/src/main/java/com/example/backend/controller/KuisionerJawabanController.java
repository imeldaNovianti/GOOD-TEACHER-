package com.example.backend.controller; // Mengimpor package untuk controller dalam aplikasi Spring

import com.example.backend.model.KuisionerJawaban; // Mengimpor model KuisionerJawaban untuk menangani data jawaban kuisioner
import com.example.backend.service.KuisionerJawabanService; // Mengimpor KuisionerJawabanService untuk menangani logika bisnis kuisioner jawaban
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk membuat controller dan menangani HTTP request

import java.util.List; // Mengimpor List untuk mengelola koleksi data dalam pengembalian hasil
import java.util.Map; // Mengimpor Map untuk menyimpan data dalam pasangan key-value

@RestController // Menandakan bahwa kelas ini adalah controller Spring yang menangani HTTP requests dan memberikan respons
@RequestMapping("/api/kuisioner-jawaban") // Menentukan path dasar untuk endpoint di controller ini
public class KuisionerJawabanController { // Mendefinisikan controller untuk menangani kuisioner jawaban

    private final KuisionerJawabanService kuisionerJawabanService; // Mendeklarasikan KuisionerJawabanService untuk menangani logika bisnis

    public KuisionerJawabanController(KuisionerJawabanService kuisionerJawabanService) { // Constructor untuk menyuntikkan KuisionerJawabanService ke dalam controller
        this.kuisionerJawabanService = kuisionerJawabanService; // Menyimpan service ke dalam field
    }

    // GET all - Mendapatkan semua data kuisioner jawaban
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua data kuisioner jawaban
    public List<KuisionerJawaban> getAll() { // Menangani permintaan GET untuk mengambil list semua kuisioner jawaban
        return kuisionerJawabanService.getAll(); // Memanggil service untuk mengambil semua data kuisioner jawaban
    }

    // GET by ID - Mendapatkan data kuisioner jawaban berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil kuisioner jawaban berdasarkan ID
    public ResponseEntity<KuisionerJawaban> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return kuisionerJawabanService.getById(id) // Memanggil service untuk mendapatkan kuisioner jawaban berdasarkan ID
                .map(ResponseEntity::ok) // Jika ditemukan, mengembalikan respon 200 OK dengan data kuisioner jawaban
                .orElse(ResponseEntity.notFound().build()); // Jika tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE satu jawaban - Membuat satu jawaban kuisioner
    @PostMapping // Mendefinisikan endpoint POST untuk membuat jawaban kuisioner
    public KuisionerJawaban create(@RequestBody KuisionerJawaban jawaban) { // Mengambil data jawaban dari body request
        return kuisionerJawabanService.create(jawaban); // Memanggil service untuk membuat jawaban dan mengembalikannya
    }

    // CREATE banyak jawaban sekaligus - Membuat banyak jawaban kuisioner sekaligus
    @PostMapping("/submit") // Mendefinisikan endpoint POST untuk mengirimkan banyak jawaban kuisioner
    public ResponseEntity<String> submit(@RequestBody List<KuisionerJawaban> jawabanList) { // Mengambil list jawaban dari body request
        if (jawabanList.isEmpty()) { // Mengecek jika list jawaban kosong
            return ResponseEntity.badRequest().body("List jawaban kosong!"); // Mengembalikan respon 400 Bad Request jika list kosong
        }

        Long siswaId = jawabanList.get(0).getSiswa().getId(); // Mengambil ID siswa dari jawaban pertama
        Long guruId = jawabanList.get(0).getGuruMapel().getId(); // Mengambil ID guru mapel dari jawaban pertama

        // ✅ Validasi: siswa hanya bisa isi sekali per guru
        if (kuisionerJawabanService.existsBySiswaIdAndGuruId(siswaId, guruId)) { // Mengecek apakah siswa sudah pernah mengisi kuisioner untuk guru ini
            return ResponseEntity.badRequest().body("❌ Kuisioner untuk guru ini sudah pernah diisi!"); // Mengembalikan respon 400 jika sudah mengisi kuisioner
        }

        kuisionerJawabanService.saveAll(jawabanList); // Menyimpan semua jawaban kuisioner yang diterima
        return ResponseEntity.ok("✅ Jawaban kuisioner berhasil disimpan!"); // Mengembalikan respon 200 OK setelah berhasil menyimpan jawaban
    }

    // UPDATE - Memperbarui data kuisioner jawaban berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui kuisioner jawaban berdasarkan ID
    public ResponseEntity<KuisionerJawaban> update(@PathVariable Long id, @RequestBody KuisionerJawaban jawabanDetails) { // Mengambil ID dan data yang akan diperbarui dari URL dan body request
        try {
            return ResponseEntity.ok(kuisionerJawabanService.update(id, jawabanDetails)); // Memanggil service untuk memperbarui kuisioner jawaban dan mengembalikannya
        } catch (RuntimeException e) { // Menangani jika terjadi exception atau data tidak ditemukan
            return ResponseEntity.notFound().build(); // Jika tidak ditemukan, mengembalikan respon 404 Not Found
        }
    }

    // DELETE - Menghapus kuisioner jawaban berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus kuisioner jawaban berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk data yang akan dihapus
        kuisionerJawabanService.delete(id); // Memanggil service untuk menghapus kuisioner jawaban berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content jika berhasil dihapus
    }

    // GET by siswa - Mendapatkan data kuisioner jawaban berdasarkan ID siswa
    @GetMapping("/siswa/{siswaId}") // Mendefinisikan endpoint GET untuk mengambil kuisioner jawaban berdasarkan ID siswa
    public List<KuisionerJawaban> getBySiswa(@PathVariable Long siswaId) { // Mengambil ID siswa dari URL
        return kuisionerJawabanService.getBySiswaId(siswaId); // Memanggil service untuk mendapatkan data kuisioner jawaban berdasarkan ID siswa
    }

    // ✅ Statistik rata-rata per guru - Mendapatkan statistik rata-rata kuisioner untuk setiap guru
    @GetMapping("/statistik/guru") // Mendefinisikan endpoint GET untuk mendapatkan statistik kuisioner per guru
    public List<Map<String, Object>> getStatistikPerGuru() { // Mengembalikan list statistik rata-rata kuisioner per guru
        return kuisionerJawabanService.getRataRataPerGuru(); // Memanggil service untuk mendapatkan statistik rata-rata kuisioner per guru
    }

    // ✅ Cek apakah siswa sudah isi kuisioner untuk guru tertentu - Mengecek apakah siswa sudah mengisi kuisioner untuk guru tertentu
    @GetMapping("/cek") // Mendefinisikan endpoint GET untuk mengecek apakah siswa sudah mengisi kuisioner untuk guru tertentu
    public Map<String, Boolean> cekSudahIsi( // Mengambil parameter siswaId dan guruId untuk pengecekan
            @RequestParam Long siswaId, // Mengambil ID siswa dari parameter query
            @RequestParam Long guruId // Mengambil ID guru dari parameter query
    ) {
        boolean sudahIsi = kuisionerJawabanService.existsBySiswaIdAndGuruId(siswaId, guruId); // Mengecek apakah siswa sudah mengisi kuisioner untuk guru ini
        return Map.of("sudahIsi", sudahIsi); // Mengembalikan hasil pengecekan dalam bentuk Map dengan key "sudahIsi"
    }
}
