package com.example.backend.controller; // Menentukan package untuk controller dalam aplikasi

import com.example.backend.model.Pertanyaan; // Mengimpor model Pertanyaan untuk menangani data pertanyaan
import com.example.backend.service.PertanyaanService; // Mengimpor service yang menangani logika bisnis untuk pertanyaan
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk menangani response HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk menangani HTTP requests

import java.util.List; // Mengimpor List untuk menangani koleksi data pertanyaan

@RestController // Menandakan bahwa kelas ini adalah Spring REST Controller
@RequestMapping("/api/pertanyaan") // Menentukan path dasar untuk semua endpoint dalam controller ini
public class PertanyaanController { // Mendefinisikan controller untuk mengelola pertanyaan

    private final PertanyaanService pertanyaanService; // Mendeklarasikan service untuk menangani logika bisnis pertanyaan

    public PertanyaanController(PertanyaanService pertanyaanService) { // Constructor untuk menyuntikkan PertanyaanService ke dalam controller
        this.pertanyaanService = pertanyaanService; // Menyimpan pertanyaanService ke dalam field
    }

    // GET all - Mendapatkan semua pertanyaan
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua pertanyaan
    public List<Pertanyaan> getAll() { // Mendefinisikan method untuk menangani permintaan GET untuk mendapatkan semua pertanyaan
        return pertanyaanService.getAll(); // Memanggil service untuk mendapatkan semua pertanyaan dan mengembalikannya
    }

    // GET by ID - Mendapatkan pertanyaan berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil pertanyaan berdasarkan ID
    public ResponseEntity<Pertanyaan> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return pertanyaanService.getById(id) // Memanggil service untuk mendapatkan pertanyaan berdasarkan ID
                .map(ResponseEntity::ok) // Jika pertanyaan ditemukan, mengembalikan respon 200 OK dengan data pertanyaan
                .orElse(ResponseEntity.notFound().build()); // Jika pertanyaan tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat pertanyaan baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat pertanyaan baru
    public Pertanyaan create(@RequestBody Pertanyaan pertanyaan) { // Mengambil data pertanyaan dari body request
        return pertanyaanService.create(pertanyaan); // Memanggil service untuk menyimpan pertanyaan dan mengembalikannya
    }

    // UPDATE - Memperbarui pertanyaan berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui pertanyaan berdasarkan ID
    public ResponseEntity<Pertanyaan> update(@PathVariable Long id, @RequestBody Pertanyaan pertanyaanDetails) { // Mengambil ID dan data pertanyaan yang akan diperbarui
        try {
            return ResponseEntity.ok(pertanyaanService.update(id, pertanyaanDetails)); // Memanggil service untuk memperbarui pertanyaan dan mengembalikannya
        } catch (RuntimeException e) { // Menangani error jika data pertanyaan tidak ditemukan
            return ResponseEntity.notFound().build(); // Mengembalikan respon 404 Not Found jika pertanyaan tidak ditemukan
        }
    }

    // DELETE - Menghapus pertanyaan berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus pertanyaan berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk pertanyaan yang akan dihapus
        pertanyaanService.delete(id); // Memanggil service untuk menghapus pertanyaan berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content sebagai indikasi bahwa data berhasil dihapus
    }

    // GET by tipeJawaban (SKALA / TEKS) - Mendapatkan pertanyaan berdasarkan tipe jawaban
    @GetMapping("/tipe/{tipeJawaban}") // Mendefinisikan endpoint GET untuk mengambil pertanyaan berdasarkan tipe jawaban (SKALA / TEKS)
    public List<Pertanyaan> getByTipeJawaban(@PathVariable String tipeJawaban) { // Mengambil tipe jawaban dari URL path
        return pertanyaanService.getByTipeJawaban(tipeJawaban); // Memanggil service untuk mendapatkan pertanyaan berdasarkan tipe jawaban
    }

    // SEARCH by teks pertanyaan - Mencari pertanyaan berdasarkan kata kunci pada teks
    @GetMapping("/search") // Mendefinisikan endpoint GET untuk mencari pertanyaan berdasarkan teks
    public List<Pertanyaan> searchByTeks(@RequestParam String keyword) { // Mengambil keyword pencarian dari query parameter
        return pertanyaanService.searchByTeks(keyword); // Memanggil service untuk mencari pertanyaan berdasarkan keyword
    }
}
