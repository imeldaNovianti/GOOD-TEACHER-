package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔍 search di beberapa kolom
    Page<User> findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String namaLengkap,
            String nisn,
            String kelas,
            String email,
            Pageable pageable
    );
}
