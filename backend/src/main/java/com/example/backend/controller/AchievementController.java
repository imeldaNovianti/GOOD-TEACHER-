package com.example.backend.controller; // Mengimpor package untuk controller dalam aplikasi Spring

import com.example.backend.model.Achievement; // Mengimpor model Achievement untuk menangani data achievement
import com.example.backend.service.AchievementService; // Mengimpor service yang menangani logika bisnis terkait achievement
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respon HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk membuat controller dan menangani HTTP request

import java.util.List; // Mengimpor List untuk menggunakan tipe koleksi dalam pengembalian hasil

@RestController // Menandakan bahwa kelas ini adalah controller Spring dan dapat meng-handle request HTTP
@RequestMapping("/api/achievements") // Menentukan path dasar untuk endpoint di controller ini
@CrossOrigin(origins = "http://localhost:5173") // Mengizinkan akses hanya dari frontend yang berjalan di localhost:5173
public class AchievementController { // Mendefinisikan controller untuk menangani achievement

    private final AchievementService service; // Mendeklarasikan service untuk menangani logika bisnis terkait achievement

    public AchievementController(AchievementService service) { // Constructor untuk menyuntikkan AchievementService ke dalam controller
        this.service = service; // Menyimpan service ke dalam field
    }

    // GET semua achievement milik user tertentu (siswa login)
    @GetMapping("/{userId}") // Mendefinisikan endpoint untuk mengambil achievement berdasarkan userId
    public ResponseEntity<List<Achievement>> getUserAchievements(@PathVariable Long userId) { // Mengambil achievement user berdasarkan userId dari URL
        if (userId == null) { // Memeriksa apakah userId null
            return ResponseEntity.badRequest().build(); // Jika null, mengembalikan respon 400 Bad Request
        }

        List<Achievement> achievements = service.getUserAchievements(userId); // Memanggil service untuk mengambil list achievement berdasarkan userId
        if (achievements.isEmpty()) { // Jika tidak ada achievement yang ditemukan
            return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content
        }

        return ResponseEntity.ok(achievements); // Mengembalikan respon 200 OK beserta list achievement
    }

    // GET + cek otomatis (bisa dipanggil dari FE)
    @GetMapping("/check/{userId}") // Mendefinisikan endpoint untuk memeriksa dan mengambil achievement berdasarkan userId
    public ResponseEntity<List<Achievement>> checkAndGet(@PathVariable Long userId) { // Mengambil achievement berdasarkan userId dari URL
        if (userId == null) { // Memeriksa apakah userId null
            return ResponseEntity.badRequest().build(); // Jika null, mengembalikan respon 400 Bad Request
        }

        List<Achievement> achievements = service.getUserAchievements(userId); // Memanggil service untuk mengambil list achievement berdasarkan userId
        if (achievements.isEmpty()) { // Jika tidak ada achievement yang ditemukan
            return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content
        }

        return ResponseEntity.ok(achievements); // Mengembalikan respon 200 OK beserta list achievement
    }

    // POST tambah achievement untuk user
    @PostMapping("/{userId}") // Mendefinisikan endpoint untuk menambah achievement bagi user berdasarkan userId
    public ResponseEntity<Achievement> addAchievement( // Menangani permintaan POST untuk menambah achievement
            @PathVariable Long userId, // Mengambil userId dari URL
            @RequestBody Achievement achievement // Mengambil data achievement dari body request
    ) {
        if (userId == null || achievement == null) { // Memeriksa apakah userId atau achievement null
            return ResponseEntity.badRequest().build(); // Jika ada yang null, mengembalikan respon 400 Bad Request
        }

        Achievement saved = service.addAchievement(userId, achievement); // Memanggil service untuk menambah achievement dan menyimpannya
        return ResponseEntity.ok(saved); // Mengembalikan respon 200 OK dengan data achievement yang baru ditambahkan
    }

    // PUT update status achievement (unlock/lock)
    @PutMapping("/{achievementId}") // Mendefinisikan endpoint untuk mengupdate status achievement berdasarkan achievementId
    public ResponseEntity<Achievement> updateAchievement( // Menangani permintaan PUT untuk memperbarui status achievement
            @PathVariable Long achievementId, // Mengambil achievementId dari URL
            @RequestParam boolean unlocked // Mengambil status unlocked (true/false) dari query parameter
    ) {
        try {
            Achievement updated = service.updateAchievement(achievementId, unlocked); // Memanggil service untuk mengupdate status achievement
            return ResponseEntity.ok(updated); // Mengembalikan respon 200 OK dengan achievement yang sudah diperbarui
        } catch (RuntimeException e) { // Menangani jika terjadi exception
            return ResponseEntity.notFound().build(); // Jika terjadi error, mengembalikan respon 404 Not Found
        }
    }
}
