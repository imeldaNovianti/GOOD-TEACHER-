package com.example.backend.controller; // Mengimpor package untuk controller dalam aplikasi Spring

import com.example.backend.model.GuruMapel; // Mengimpor model GuruMapel untuk menangani data guru dan mata pelajaran
import com.example.backend.service.GuruMapelService; // Mengimpor GuruMapelService yang menangani logika bisnis terkait guru dan mata pelajaran
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk membuat controller dan menangani HTTP request

import java.util.List; // Mengimpor List untuk menggunakan koleksi dalam pengembalian hasil

@RestController // Menandakan bahwa kelas ini adalah controller Spring yang menangani HTTP requests dan memberikan respons
@RequestMapping("/api/guru-mapel") // Menentukan path dasar untuk endpoint di controller ini
public class GuruMapelController { // Mendefinisikan controller untuk menangani guru dan mata pelajaran

    private final GuruMapelService guruMapelService; // Mendeklarasikan GuruMapelService untuk menangani logika bisnis guru dan mata pelajaran

    public GuruMapelController(GuruMapelService guruMapelService) { // Constructor untuk menyuntikkan GuruMapelService ke dalam controller
        this.guruMapelService = guruMapelService; // Menyimpan service ke dalam field
    }

    // GET all - Mendapatkan semua data guru dan mata pelajaran
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua data guru dan mata pelajaran
    public List<GuruMapel> getAll() { // Menangani permintaan GET untuk mengambil list semua guru dan mata pelajaran
        return guruMapelService.getAll(); // Memanggil service untuk mengambil semua data guru dan mata pelajaran
    }

    // GET by ID - Mendapatkan data guru dan mata pelajaran berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil guru dan mata pelajaran berdasarkan ID
    public ResponseEntity<GuruMapel> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return guruMapelService.getById(id) // Memanggil service untuk mendapatkan guru dan mata pelajaran berdasarkan ID
                .map(ResponseEntity::ok) // Jika ditemukan, mengembalikan respon 200 OK dengan data guru dan mata pelajaran
                .orElse(ResponseEntity.notFound().build()); // Jika tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat data guru dan mata pelajaran baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat guru dan mata pelajaran baru
    public GuruMapel create(@RequestBody GuruMapel guruMapel) { // Mengambil data guru dan mata pelajaran dari body request
        return guruMapelService.create(guruMapel); // Memanggil service untuk membuat guru dan mata pelajaran baru dan mengembalikannya
    }

    // UPDATE - Memperbarui data guru dan mata pelajaran berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui guru dan mata pelajaran berdasarkan ID
    public ResponseEntity<GuruMapel> update(@PathVariable Long id, @RequestBody GuruMapel guruMapelDetails) { // Mengambil ID dan data yang akan diperbarui dari URL dan body request
        try {
            return ResponseEntity.ok(guruMapelService.update(id, guruMapelDetails)); // Memanggil service untuk memperbarui data dan mengembalikan respon 200 OK dengan data yang diperbarui
        } catch (RuntimeException e) { // Menangani jika terjadi exception atau data tidak ditemukan
            return ResponseEntity.notFound().build(); // Jika terjadi exception atau tidak ditemukan, mengembalikan respon 404 Not Found
        }
    }

    // DELETE - Menghapus data guru dan mata pelajaran berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus guru dan mata pelajaran berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk data yang akan dihapus
        guruMapelService.delete(id); // Memanggil service untuk menghapus data guru dan mata pelajaran berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content jika berhasil dihapus
    }

    // SEARCH by namaGuru - Mencari data guru dan mata pelajaran berdasarkan nama guru
    @GetMapping("/search/nama") // Mendefinisikan endpoint GET untuk mencari data guru dan mata pelajaran berdasarkan nama guru
    public List<GuruMapel> searchByNama(@RequestParam String keyword) { // Mengambil keyword pencarian dari parameter query
        return guruMapelService.searchByNamaGuru(keyword); // Memanggil service untuk mencari guru berdasarkan nama dan mengembalikannya
    }

    // SEARCH by mataPelajaran - Mencari data guru dan mata pelajaran berdasarkan mata pelajaran
    @GetMapping("/search/mapel") // Mendefinisikan endpoint GET untuk mencari data guru dan mata pelajaran berdasarkan mata pelajaran
    public List<GuruMapel> searchByMapel(@RequestParam String keyword) { // Mengambil keyword pencarian dari parameter query
        return guruMapelService.searchByMataPelajaran(keyword); // Memanggil service untuk mencari guru berdasarkan mata pelajaran dan mengembalikannya
    }

    // SORT - Mengurutkan data guru dan mata pelajaran berdasarkan namaGuru atau mataPelajaran
    @GetMapping("/sort") // Mendefinisikan endpoint GET untuk mengurutkan data guru dan mata pelajaran
    public List<GuruMapel> sortByField( // Menangani permintaan GET untuk mengurutkan data
            @RequestParam String by, // Mengambil parameter field yang digunakan untuk pengurutan (namaGuru atau mataPelajaran)
            @RequestParam(defaultValue = "asc") String direction) { // Mengambil parameter direction untuk pengurutan (default: asc)
        return guruMapelService.sortByField(by, direction); // Memanggil service untuk mengurutkan data berdasarkan field dan arah pengurutan, kemudian mengembalikannya
    }
}
