package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Achievement; // Mengimpor model Achievement
import com.example.backend.model.User; // Mengimpor model User
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar

import java.util.List; // Mengimpor List untuk pengembalian banyak data

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    // Method untuk mencari achievement berdasarkan user tertentu
    List<Achievement> findByUser(User user);
}
