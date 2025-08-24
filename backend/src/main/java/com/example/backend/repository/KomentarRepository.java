package com.example.backend.repository;

import com.example.backend.model.Komentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KomentarRepository extends JpaRepository<Komentar, Long> {
    List<Komentar> findByGuruMapelId(Long guruMapelId);
    List<Komentar> findBySiswaId(Long siswaId);
    List<Komentar> findByPeriodeId(Long periodeId);
}
