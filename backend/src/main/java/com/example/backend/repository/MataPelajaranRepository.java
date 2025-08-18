package com.example.backend.repository;

import com.example.backend.model.MataPelajaran;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MataPelajaranRepository extends JpaRepository<MataPelajaran, Long> {
    Page<MataPelajaran> findByNamaContainingIgnoreCase(String nama, Pageable pageable);
    Page<MataPelajaran> findByJurusan_Id(Long jurusanId, Pageable pageable);
}
