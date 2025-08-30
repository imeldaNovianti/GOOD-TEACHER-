package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Feedback; // Mengimpor model Feedback
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar

import java.util.List; // Mengimpor List untuk pengembalian banyak data

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Method untuk mencari feedback berdasarkan ID user
    List<Feedback> findByUserId(Long userId);

    // Method untuk mencari feedback berdasarkan tipe (contoh: "POSITIF", "NEGATIF")
    List<Feedback> findByType(String type);
}
