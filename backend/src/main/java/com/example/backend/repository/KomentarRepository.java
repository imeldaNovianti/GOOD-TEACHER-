package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Komentar; // Mengimpor model Komentar
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface KomentarRepository extends JpaRepository<Komentar, Long> {
    // Method untuk mencari komentar berdasarkan ID guru mapel
    List<Komentar> findByGuruMapelId(Long guruMapelId);

    // Method untuk mencari komentar berdasarkan ID siswa
    List<Komentar> findBySiswaId(Long siswaId);

    // Method untuk mencari komentar berdasarkan ID periode kuisioner
    List<Komentar> findByPeriodeId(Long periodeId);
}
