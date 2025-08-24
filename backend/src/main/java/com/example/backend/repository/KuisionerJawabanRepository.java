package com.example.backend.repository;

import com.example.backend.model.KuisionerJawaban;
import com.example.backend.model.GuruMapel;
import com.example.backend.model.User;
import com.example.backend.model.Pertanyaan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KuisionerJawabanRepository extends JpaRepository<KuisionerJawaban, Long> {
    List<KuisionerJawaban> findBySiswa(User siswa);
    List<KuisionerJawaban> findByGuruMapel(GuruMapel guruMapel);
    List<KuisionerJawaban> findByPertanyaan(Pertanyaan pertanyaan);

    // ✅ Query custom untuk statistik rata-rata per guru
    @Query("SELECT k.guruMapel.namaGuru, k.guruMapel.mataPelajaran, AVG(k.jawaban) " +
           "FROM KuisionerJawaban k " +
           "GROUP BY k.guruMapel.namaGuru, k.guruMapel.mataPelajaran")
    List<Object[]> getRataRataPerGuru();
}
