package com.example.backend.service; // Menentukan package untuk service ini

import com.example.backend.model.Feedback; // Mengimpor model Feedback
import com.example.backend.repository.FeedbackRepository; // Mengimpor repository Feedback
import org.springframework.stereotype.Service; // Mengimpor anotasi Service

import java.util.List; // Mengimpor List untuk pengembalian banyak data
import java.util.Optional; // Mengimpor Optional untuk pengecekan data yang bisa ada atau tidak

@Service // Menandakan bahwa kelas ini adalah service yang dikelola oleh Spring
public class FeedbackService {

    private final FeedbackRepository repo; // Mendeklarasikan repository Feedback

    // Constructor injection untuk repository Feedback
    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    // =====================================
    // Membuat feedback baru
    // =====================================
    public Feedback createFeedback(Feedback feedback) {
        // Menyimpan feedback baru ke database
        return repo.save(feedback);
    }

    // =====================================
    // Memperbarui data feedback
    // =====================================
    public Feedback updateFeedback(Long id, Feedback newData) {
        // Mencari feedback berdasarkan ID
        Optional<Feedback> opt = repo.findById(id);
        if (opt.isPresent()) {
            Feedback f = opt.get();
            // Mengupdate data feedback dengan data baru
            f.setType(newData.getType());
            f.setTitle(newData.getTitle());
            f.setContent(newData.getContent());
            f.setThemeColor(newData.getThemeColor());
            f.setAnonim(newData.getAnonim());
            // Menyimpan perubahan data feedback dan mengembalikannya
            return repo.save(f);
        }
        // Mengembalikan null jika feedback tidak ditemukan
        return null;
    }

    // =====================================
    // Menghapus feedback berdasarkan ID
    // =====================================
    public boolean deleteFeedback(Long id) {
        // Cek apakah feedback ada di database
        if (repo.existsById(id)) {
            // Menghapus feedback berdasarkan ID
            repo.deleteById(id);
            return true;
        }
        // Mengembalikan false jika feedback tidak ditemukan
        return false;
    }

    // =====================================
    // Mendapatkan semua feedback
    // =====================================
    public List<Feedback> getAllFeedback() {
        // Mengambil semua feedback dari database
        return repo.findAll();
    }

    // =====================================
    // Mendapatkan feedback berdasarkan userId
    // =====================================
    public List<Feedback> getFeedbackByUser(Long userId) {
        // Mengambil semua feedback yang terkait dengan user tertentu
        return repo.findByUserId(userId);
    }

    // =====================================
    // Mendapatkan feedback berdasarkan tipe
    // 🔥 Tambahan
    // =====================================
    public List<Feedback> getFeedbackByType(String type) {
        // Menyaring feedback berdasarkan tipe (misalnya "SARAN" atau "UCAPAN")
        return repo.findByType(type.toUpperCase()); // Menggunakan uppercase agar konsisten
    }

    // =====================================
    // Mendapatkan feedback berdasarkan ID
    // =====================================
    public Optional<Feedback> getById(Long id) {
        // Mencari feedback berdasarkan ID
        return repo.findById(id);
    }
}
