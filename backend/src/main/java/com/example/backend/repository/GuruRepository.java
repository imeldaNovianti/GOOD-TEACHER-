package com.example.backend.repository;

import com.example.backend.model.Guru;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuruRepository extends JpaRepository<Guru, Long> {
    Page<Guru> findByNamaContainingIgnoreCase(String nama, Pageable pageable);
    Page<Guru> findByFakultas_Id(Long fakultasId, Pageable pageable);
}
