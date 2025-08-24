package com.example.backend.repository;

import com.example.backend.model.GuruMapel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuruMapelRepository extends JpaRepository<GuruMapel, Long> {
    List<GuruMapel> findByNamaGuruContainingIgnoreCase(String namaGuru);
    List<GuruMapel> findByMataPelajaranContainingIgnoreCase(String mataPelajaran);
}
