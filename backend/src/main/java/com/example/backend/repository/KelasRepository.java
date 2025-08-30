package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.Kelas; // Mengimpor model Kelas
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface KelasRepository extends JpaRepository<Kelas, Long> {
    // Method untuk mencari kelas berdasarkan nama kelas (dengan pencarian tidak sensitif terhadap huruf besar/kecil)
    List<Kelas> findByNamaKelasContainingIgnoreCase(String namaKelas);

    // Method untuk mencari kelas berdasarkan wali kelas (dengan pencarian tidak sensitif terhadap huruf besar/kecil)
    List<Kelas> findByWaliKelasContainingIgnoreCase(String waliKelas);
}
