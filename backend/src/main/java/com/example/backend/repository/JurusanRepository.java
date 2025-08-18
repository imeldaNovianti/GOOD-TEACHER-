package com.example.backend.repository;

import com.example.backend.model.Jurusan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JurusanRepository extends JpaRepository<Jurusan, Long> {
    Page<Jurusan> findByNamaContainingIgnoreCase(String nama, Pageable pageable);
    Page<Jurusan> findByFakultas_Id(Long fakultasId, Pageable pageable);
}
