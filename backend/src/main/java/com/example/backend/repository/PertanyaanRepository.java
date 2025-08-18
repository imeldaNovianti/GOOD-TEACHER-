package com.example.backend.repository;

import com.example.backend.model.Pertanyaan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PertanyaanRepository extends JpaRepository<Pertanyaan, Long> {
}
