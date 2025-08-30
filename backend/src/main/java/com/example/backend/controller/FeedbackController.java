package com.example.backend.controller; // Mengimpor package untuk controller dalam aplikasi Spring

import com.example.backend.model.Feedback; // Mengimpor model Feedback untuk menangani data feedback
import com.example.backend.service.FeedbackService; // Mengimpor FeedbackService yang menangani logika bisnis terkait feedback
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk membuat controller dan menangani HTTP request

import java.util.List; // Mengimpor List untuk menggunakan koleksi dalam pengembalian hasil

@RestController // Menandakan bahwa kelas ini adalah controller Spring dan dapat meng-handle request HTTP
@RequestMapping("/api/feedback") // Menentukan path dasar untuk endpoint di controller ini
public class FeedbackController { // Mendefinisikan controller untuk menangani feedback

    private final FeedbackService service; // Mendeklarasikan FeedbackService untuk menangani logika bisnis feedback

    public FeedbackController(FeedbackService service) { // Constructor untuk menyuntikkan FeedbackService ke dalam controller
        this.service = service; // Menyimpan service ke dalam field
    }

    // POST endpoint untuk membuat feedback baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat feedback
    public ResponseEntity<Feedback> create(@RequestBody Feedback feedback) { // Menangani permintaan POST untuk membuat feedback baru
        return ResponseEntity.ok(service.createFeedback(feedback)); // Memanggil service untuk membuat feedback dan mengembalikan respon 200 OK
    }

    // GET endpoint untuk mendapatkan semua feedback
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua feedback
    public ResponseEntity<List<Feedback>> getAll() { // Menangani permintaan GET untuk mendapatkan list semua feedback
        return ResponseEntity.ok(service.getAllFeedback()); // Memanggil service untuk mengambil semua feedback dan mengembalikan respon 200 OK
    }

    // GET endpoint untuk mendapatkan feedback berdasarkan userId
    @GetMapping("/user/{userId}") // Mendefinisikan endpoint GET untuk mengambil feedback berdasarkan userId
    public ResponseEntity<List<Feedback>> getByUser(@PathVariable Long userId) { // Mengambil feedback berdasarkan userId dari URL
        return ResponseEntity.ok(service.getFeedbackByUser(userId)); // Memanggil service untuk mengambil feedback berdasarkan userId dan mengembalikan respon 200 OK
    }

    // 🔥 Tambahan: filter by type - GET endpoint untuk mendapatkan feedback berdasarkan tipe
    @GetMapping("/type/{type}") // Mendefinisikan endpoint GET untuk mengambil feedback berdasarkan tipe
    public ResponseEntity<List<Feedback>> getByType(@PathVariable String type) { // Mengambil feedback berdasarkan tipe dari URL
        return ResponseEntity.ok(service.getFeedbackByType(type)); // Memanggil service untuk mengambil feedback berdasarkan tipe dan mengembalikan respon 200 OK
    }

    // GET endpoint untuk mendapatkan feedback berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil feedback berdasarkan ID
    public ResponseEntity<Feedback> getById(@PathVariable Long id) { // Mengambil feedback berdasarkan ID dari URL
        return service.getById(id) // Memanggil service untuk mengambil feedback berdasarkan ID
                .map(ResponseEntity::ok) // Jika ditemukan, mengembalikan respon 200 OK dengan data feedback
                .orElse(ResponseEntity.notFound().build()); // Jika tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // PUT endpoint untuk memperbarui feedback berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui feedback berdasarkan ID
    public ResponseEntity<Feedback> update(@PathVariable Long id, @RequestBody Feedback feedback) { // Menangani permintaan PUT untuk memperbarui feedback
        Feedback updated = service.updateFeedback(id, feedback); // Memanggil service untuk memperbarui feedback
        if (updated != null) return ResponseEntity.ok(updated); // Jika berhasil diperbarui, mengembalikan respon 200 OK dengan data feedback yang diperbarui
        return ResponseEntity.notFound().build(); // Jika tidak ditemukan feedback untuk diperbarui, mengembalikan respon 404 Not Found
    }

    // DELETE endpoint untuk menghapus feedback berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus feedback berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Menangani permintaan DELETE untuk menghapus feedback berdasarkan ID
        if (service.deleteFeedback(id)) return ResponseEntity.ok().build(); // Jika berhasil dihapus, mengembalikan respon 200 OK
        return ResponseEntity.notFound().build(); // Jika tidak ditemukan feedback yang akan dihapus, mengembalikan respon 404 Not Found
    }
}
