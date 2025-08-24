package com.example.backend.repository;

import com.example.backend.model.Kelas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KelasRepository extends JpaRepository<Kelas, Long> {
    List<Kelas> findByNamaKelasContainingIgnoreCase(String namaKelas);
    List<Kelas> findByWaliKelasContainingIgnoreCase(String waliKelas);
}
