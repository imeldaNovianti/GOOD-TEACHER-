package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.User; // Mengimpor model User
import org.springframework.data.domain.Page; // Mengimpor Page untuk pagination
import org.springframework.data.domain.Pageable; // Mengimpor Pageable untuk pengaturan paging
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar

import java.util.Optional; // Mengimpor Optional untuk menangani nilai yang mungkin kosong

public interface UserRepository extends JpaRepository<User, Long> {

    // Method untuk mencari user berdasarkan nama lengkap, nisn, kelas, atau email dengan paging
    Page<User> findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String namaLengkap,
            String nisn,
            String kelas,
            String email,
            Pageable pageable
    );

    // Method untuk mencari user berdasarkan username (untuk login)
    User findByUsername(String username);

    // Method untuk mencari user berdasarkan email (untuk login)
    Optional<User> findByEmail(String email);
}
