package com.example.backend.repository;

import com.example.backend.model.Kuisioner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KuisionerRepository extends JpaRepository<Kuisioner, Long> {
    Page<Kuisioner> findByJudulContainingIgnoreCase(String judul, Pageable pageable);
}
