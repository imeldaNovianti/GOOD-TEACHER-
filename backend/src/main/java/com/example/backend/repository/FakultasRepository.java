package com.example.backend.repository;

import com.example.backend.model.Fakultas;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FakultasRepository extends JpaRepository<Fakultas, Long> {
    Page<Fakultas> findByNamaContainingIgnoreCase(String nama, Pageable pageable);
}
