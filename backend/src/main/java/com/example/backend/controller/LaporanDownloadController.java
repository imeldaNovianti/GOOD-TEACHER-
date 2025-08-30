package com.example.backend.controller; // Menentukan package controller untuk aplikasi

import com.example.backend.model.LaporanDownload; // Mengimpor model LaporanDownload yang berisi data laporan download
import com.example.backend.service.LaporanDownloadService; // Mengimpor LaporanDownloadService yang menangani logika bisnis untuk laporan download
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus hasil respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk menangani HTTP requests

import java.util.List; // Mengimpor List untuk menangani koleksi data laporan download

@RestController // Menandakan bahwa kelas ini adalah Spring REST Controller
@RequestMapping("/api/laporan-download") // Menentukan path dasar untuk endpoint API laporan download
public class LaporanDownloadController { // Mendefinisikan controller untuk mengelola laporan download

    private final LaporanDownloadService laporanDownloadService; // Mendeklarasikan service untuk menangani laporan download

    public LaporanDownloadController(LaporanDownloadService laporanDownloadService) { // Constructor untuk menyuntikkan LaporanDownloadService ke dalam controller
        this.laporanDownloadService = laporanDownloadService; // Menyimpan service ke dalam field
    }

    // GET all - Mendapatkan semua laporan download
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua laporan download
    public List<LaporanDownload> getAll() { // Mendefinisikan method untuk menangani permintaan GET untuk mengambil semua laporan download
        return laporanDownloadService.getAll(); // Memanggil service untuk mengambil semua laporan download dan mengembalikannya
    }

    // GET by ID - Mendapatkan laporan download berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil laporan download berdasarkan ID
    public ResponseEntity<LaporanDownload> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return laporanDownloadService.getById(id) // Memanggil service untuk mendapatkan laporan download berdasarkan ID
                .map(ResponseEntity::ok) // Jika laporan ditemukan, mengembalikan respon 200 OK dengan data laporan download
                .orElse(ResponseEntity.notFound().build()); // Jika laporan tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat laporan download baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat laporan download baru
    public LaporanDownload create(@RequestBody LaporanDownload laporanDownload) { // Mengambil data laporan download dari body request
        return laporanDownloadService.create(laporanDownload); // Memanggil service untuk menyimpan laporan download dan mengembalikannya
    }

    // UPDATE - Memperbarui laporan download berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui laporan download berdasarkan ID
    public ResponseEntity<LaporanDownload> update(@PathVariable Long id, @RequestBody LaporanDownload laporanDownloadDetails) { // Mengambil ID dan data laporan download yang akan diperbarui
        try {
            return ResponseEntity.ok(laporanDownloadService.update(id, laporanDownloadDetails)); // Memanggil service untuk memperbarui laporan download dan mengembalikannya
        } catch (RuntimeException e) { // Menangani error jika data laporan download tidak ditemukan
            return ResponseEntity.notFound().build(); // Mengembalikan respon 404 Not Found jika laporan download tidak ditemukan
        }
    }

    // DELETE - Menghapus laporan download berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus laporan download berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk laporan yang akan dihapus
        laporanDownloadService.delete(id); // Memanggil service untuk menghapus laporan download berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content sebagai indikasi bahwa data berhasil dihapus
    }
}
