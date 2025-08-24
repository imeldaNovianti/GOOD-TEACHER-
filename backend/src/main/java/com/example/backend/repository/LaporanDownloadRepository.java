package com.example.backend.repository;

import com.example.backend.model.LaporanDownload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LaporanDownloadRepository extends JpaRepository<LaporanDownload, Long> {
}
