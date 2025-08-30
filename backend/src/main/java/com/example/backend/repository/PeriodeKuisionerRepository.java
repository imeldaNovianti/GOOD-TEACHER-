package com.example.backend.repository; // Menentukan package untuk repository ini

import com.example.backend.model.PeriodeKuisioner; // Mengimpor model PeriodeKuisioner
import org.springframework.data.jpa.repository.JpaRepository; // Mengimpor JpaRepository untuk operasi CRUD standar
import org.springframework.stereotype.Repository; // Mengimpor anotasi Repository

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Repository // Menandakan bahwa ini adalah sebuah repository
public interface PeriodeKuisionerRepository extends JpaRepository<PeriodeKuisioner, Long> {
    // Method untuk mencari periode kuisioner berdasarkan status
    List<PeriodeKuisioner> findByStatus(String status);
}
