package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔍 search di beberapa kolom
    Page<User> findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String namaLengkap,
            String nisn,
            String kelas,
            String email,
            Pageable pageable
    );

    // untuk login dengan username
    User findByUsername(String username);

    // untuk login dengan email
    Optional<User> findByEmail(String email);
}
