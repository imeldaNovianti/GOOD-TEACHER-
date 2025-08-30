package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.KuisionerJawaban; // Mengimpor model KuisionerJawaban
import com.example.backend.model.GuruMapel; // Mengimpor model GuruMapel
import com.example.backend.model.User; // Mengimpor model User
import com.example.backend.model.Pertanyaan; // Mengimpor model Pertanyaan
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.data.jpa.repository.Query; // Mengimpor Query untuk custom SQL
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface KuisionerJawabanRepository extends JpaRepository<KuisionerJawaban, Long> {
    
    // Method untuk mencari jawaban kuisioner berdasarkan siswa
    List<KuisionerJawaban> findBySiswa(User siswa);

    // Method untuk mencari jawaban kuisioner berdasarkan guru mapel
    List<KuisionerJawaban> findByGuruMapel(GuruMapel guruMapel);

    // Method untuk mencari jawaban kuisioner berdasarkan pertanyaan
    List<KuisionerJawaban> findByPertanyaan(Pertanyaan pertanyaan);

    // Query untuk menghitung rata-rata jawaban per guru
    @Query("SELECT k.guruMapel.namaGuru, k.guruMapel.mataPelajaran, AVG(k.jawaban) " +
           "FROM KuisionerJawaban k " +
           "GROUP BY k.guruMapel.namaGuru, k.guruMapel.mataPelajaran")
    List<Object[]> getRataRataPerGuru();

    // Method untuk mengecek apakah ada jawaban dari siswa tertentu untuk guru mapel tertentu
    boolean existsBySiswaIdAndGuruMapelId(Long siswaId, Long guruMapelId);
}
