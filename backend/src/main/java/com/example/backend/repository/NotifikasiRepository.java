package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Notifikasi; // Mengimpor model Notifikasi
import com.example.backend.model.User; // Mengimpor model User
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {
    // Method untuk mencari notifikasi berdasarkan user
    List<Notifikasi> findByUser(User user);

    // Method untuk mencari notifikasi berdasarkan status
    List<Notifikasi> findByStatus(String status);
}
