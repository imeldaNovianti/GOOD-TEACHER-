package com.example.backend.repository;

import com.example.backend.model.PeriodeKuisioner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeriodeKuisionerRepository extends JpaRepository<PeriodeKuisioner, Long> {
    List<PeriodeKuisioner> findByStatus(String status);
}
