package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.GuruMapel; // Mengimpor model GuruMapel
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface GuruMapelRepository extends JpaRepository<GuruMapel, Long> {
    // Method untuk mencari guru berdasarkan nama (dengan pencarian tidak sensitif terhadap huruf besar/kecil)
    List<GuruMapel> findByNamaGuruContainingIgnoreCase(String namaGuru);

    // Method untuk mencari guru berdasarkan mata pelajaran (dengan pencarian tidak sensitif terhadap huruf besar/kecil)
    List<GuruMapel> findByMataPelajaranContainingIgnoreCase(String mataPelajaran);
}
