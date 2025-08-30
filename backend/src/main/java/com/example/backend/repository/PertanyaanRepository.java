package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Pertanyaan; // Mengimpor model Pertanyaan
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface PertanyaanRepository extends JpaRepository<Pertanyaan, Long> {
    // Method untuk mencari pertanyaan berdasarkan tipe jawaban (SKALA atau TEKS)
    List<Pertanyaan> findByTipeJawaban(String tipeJawaban);

    // Method untuk mencari pertanyaan berdasarkan teks yang mengandung kata kunci tertentu
    List<Pertanyaan> findByTeksContainingIgnoreCase(String keyword);
}
