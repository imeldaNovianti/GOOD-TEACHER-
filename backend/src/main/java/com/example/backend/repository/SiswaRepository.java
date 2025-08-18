package com.example.backend.repository;

import com.example.backend.model.Siswa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiswaRepository extends JpaRepository<Siswa, Long> {
    Page<Siswa> findByNamaContainingIgnoreCase(String nama, Pageable pageable);
    Page<Siswa> findByNimContainingIgnoreCase(String nim, Pageable pageable);
    Page<Siswa> findByJurusan_Id(Long jurusanId, Pageable pageable);
}
