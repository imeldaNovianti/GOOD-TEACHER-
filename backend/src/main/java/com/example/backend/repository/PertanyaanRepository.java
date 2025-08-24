package com.example.backend.repository;

import com.example.backend.model.Pertanyaan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PertanyaanRepository extends JpaRepository<Pertanyaan, Long> {
    List<Pertanyaan> findByTipeJawaban(String tipeJawaban);
    List<Pertanyaan> findByTeksContainingIgnoreCase(String keyword);
}
