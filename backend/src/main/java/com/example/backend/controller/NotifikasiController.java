package com.example.backend.controller; // Menentukan package untuk controller dalam aplikasi

import com.example.backend.model.Notifikasi; // Mengimpor model Notifikasi untuk menangani data notifikasi
import com.example.backend.model.User; // Mengimpor model User untuk menangani data user
import com.example.backend.service.NotifikasiService; // Mengimpor service yang menangani logika bisnis untuk notifikasi
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk menangani response HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk menangani HTTP requests

import java.util.List; // Mengimpor List untuk menangani koleksi data notifikasi

@RestController // Menandakan bahwa kelas ini adalah Spring REST Controller
@RequestMapping("/api/notifikasi") // Menentukan path dasar untuk semua endpoint dalam controller ini
public class NotifikasiController { // Mendefinisikan controller untuk mengelola notifikasi

    private final NotifikasiService notifikasiService; // Mendeklarasikan service untuk menangani logika bisnis notifikasi

    public NotifikasiController(NotifikasiService notifikasiService) { // Constructor untuk menyuntikkan NotifikasiService ke dalam controller
        this.notifikasiService = notifikasiService; // Menyimpan notifikasiService ke dalam field
    }

    // GET all - Mendapatkan semua notifikasi
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua notifikasi
    public List<Notifikasi> getAll() { // Mendefinisikan method untuk menangani permintaan GET untuk mendapatkan semua notifikasi
        return notifikasiService.getAll(); // Memanggil service untuk mendapatkan semua notifikasi dan mengembalikannya
    }

    // GET by ID - Mendapatkan notifikasi berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil notifikasi berdasarkan ID
    public ResponseEntity<Notifikasi> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return notifikasiService.getById(id) // Memanggil service untuk mendapatkan notifikasi berdasarkan ID
                .map(ResponseEntity::ok) // Jika notifikasi ditemukan, mengembalikan respon 200 OK dengan data notifikasi
                .orElse(ResponseEntity.notFound().build()); // Jika notifikasi tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat notifikasi baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat notifikasi baru
    public Notifikasi create(@RequestBody Notifikasi notifikasi) { // Mengambil data notifikasi dari body request
        return notifikasiService.create(notifikasi); // Memanggil service untuk menyimpan notifikasi dan mengembalikannya
    }

    // UPDATE - Memperbarui notifikasi berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui notifikasi berdasarkan ID
    public ResponseEntity<Notifikasi> update(@PathVariable Long id, @RequestBody Notifikasi notifikasiDetails) { // Mengambil ID dan data notifikasi yang akan diperbarui
        try {
            return ResponseEntity.ok(notifikasiService.update(id, notifikasiDetails)); // Memanggil service untuk memperbarui notifikasi dan mengembalikannya
        } catch (RuntimeException e) { // Menangani error jika data notifikasi tidak ditemukan
            return ResponseEntity.notFound().build(); // Mengembalikan respon 404 Not Found jika notifikasi tidak ditemukan
        }
    }

    // DELETE - Menghapus notifikasi berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus notifikasi berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk notifikasi yang akan dihapus
        notifikasiService.delete(id); // Memanggil service untuk menghapus notifikasi berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content sebagai indikasi bahwa data berhasil dihapus
    }

    // GET by status - Mendapatkan notifikasi berdasarkan status
    @GetMapping("/status/{status}") // Mendefinisikan endpoint GET untuk mengambil notifikasi berdasarkan status
    public List<Notifikasi> getByStatus(@PathVariable String status) { // Mengambil status dari URL path
        return notifikasiService.getByStatus(status); // Memanggil service untuk mendapatkan notifikasi berdasarkan status
    }

    // GET by user id - Mendapatkan notifikasi berdasarkan ID user
    @GetMapping("/user/{userId}") // Mendefinisikan endpoint GET untuk mengambil notifikasi berdasarkan ID user
    public List<Notifikasi> getByUser(@PathVariable Long userId) { // Mengambil ID user dari URL path
        User user = new User(); // Membuat instance objek User
        user.setId(userId); // Menetapkan ID user yang diterima dari URL path
        return notifikasiService.getByUser(user); // Memanggil service untuk mendapatkan notifikasi berdasarkan user yang diberikan
    }
}
