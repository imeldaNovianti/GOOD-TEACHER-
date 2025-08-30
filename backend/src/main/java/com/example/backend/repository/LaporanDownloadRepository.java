package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.LaporanDownload; // Mengimpor model LaporanDownload
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface LaporanDownloadRepository extends JpaRepository<LaporanDownload, Long> {
    // Repository untuk mengakses entitas LaporanDownload
}
