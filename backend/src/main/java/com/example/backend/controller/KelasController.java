package com.example.backend.controller; // Mengimpor package untuk controller dalam aplikasi Spring

import com.example.backend.model.Kelas; // Mengimpor model Kelas untuk menangani data kelas
import com.example.backend.service.KelasService; // Mengimpor KelasService yang menangani logika bisnis terkait kelas
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk membuat controller dan menangani HTTP request

import java.util.List; // Mengimpor List untuk menggunakan koleksi dalam pengembalian hasil

@RestController // Menandakan bahwa kelas ini adalah controller Spring yang menangani HTTP requests dan memberikan respons
@RequestMapping("/api/kelas") // Menentukan path dasar untuk endpoint di controller ini
public class KelasController { // Mendefinisikan controller untuk menangani data kelas

    private final KelasService kelasService; // Mendeklarasikan KelasService untuk menangani logika bisnis kelas

    public KelasController(KelasService kelasService) { // Constructor untuk menyuntikkan KelasService ke dalam controller
        this.kelasService = kelasService; // Menyimpan service ke dalam field
    }

    // GET all - Mendapatkan semua data kelas
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua data kelas
    public List<Kelas> getAll() { // Menangani permintaan GET untuk mengambil list semua kelas
        return kelasService.getAll(); // Memanggil service untuk mengambil semua data kelas
    }

    // GET by ID - Mendapatkan data kelas berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil kelas berdasarkan ID
    public ResponseEntity<Kelas> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return kelasService.getById(id) // Memanggil service untuk mendapatkan kelas berdasarkan ID
                .map(ResponseEntity::ok) // Jika ditemukan, mengembalikan respon 200 OK dengan data kelas
                .orElse(ResponseEntity.notFound().build()); // Jika tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat data kelas baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat kelas baru
    public Kelas create(@RequestBody Kelas kelas) { // Mengambil data kelas dari body request
        return kelasService.create(kelas); // Memanggil service untuk membuat kelas baru dan mengembalikannya
    }

    // UPDATE - Memperbarui data kelas berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui kelas berdasarkan ID
    public ResponseEntity<Kelas> update(@PathVariable Long id, @RequestBody Kelas kelasDetails) { // Mengambil ID dan data yang akan diperbarui dari URL dan body request
        try {
            return ResponseEntity.ok(kelasService.update(id, kelasDetails)); // Memanggil service untuk memperbarui data kelas dan mengembalikan respon 200 OK dengan data yang diperbarui
        } catch (RuntimeException e) { // Menangani jika terjadi exception atau data tidak ditemukan
            return ResponseEntity.notFound().build(); // Jika terjadi exception atau tidak ditemukan, mengembalikan respon 404 Not Found
        }
    }

    // DELETE - Menghapus data kelas berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus kelas berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk data yang akan dihapus
        kelasService.delete(id); // Memanggil service untuk menghapus data kelas berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content jika berhasil dihapus
    }

    // SEARCH by namaKelas - Mencari data kelas berdasarkan nama kelas
    @GetMapping("/search/nama") // Mendefinisikan endpoint GET untuk mencari data kelas berdasarkan nama kelas
    public List<Kelas> searchByNama(@RequestParam String keyword) { // Mengambil keyword pencarian dari parameter query
        return kelasService.searchByNama(keyword); // Memanggil service untuk mencari kelas berdasarkan nama dan mengembalikannya
    }

    // SEARCH by waliKelas - Mencari data kelas berdasarkan wali kelas
    @GetMapping("/search/wali") // Mendefinisikan endpoint GET untuk mencari data kelas berdasarkan wali kelas
    public List<Kelas> searchByWali(@RequestParam String keyword) { // Mengambil keyword pencarian dari parameter query
        return kelasService.searchByWali(keyword); // Memanggil service untuk mencari kelas berdasarkan wali kelas dan mengembalikannya
    }

    // SORT - Mengurutkan data kelas berdasarkan namaKelas atau waliKelas
    @GetMapping("/sort") // Mendefinisikan endpoint GET untuk mengurutkan data kelas
    public List<Kelas> sortByField( // Menangani permintaan GET untuk mengurutkan data kelas
            @RequestParam String by, // Mengambil parameter field yang digunakan untuk pengurutan (namaKelas atau waliKelas)
            @RequestParam(defaultValue = "asc") String direction) { // Mengambil parameter direction untuk pengurutan (default: asc)
        return kelasService.sortByField(by, direction); // Memanggil service untuk mengurutkan data berdasarkan field dan arah pengurutan, kemudian mengembalikannya
    }
}
