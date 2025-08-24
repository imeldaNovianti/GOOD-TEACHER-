package com.example.backend.repository;

import com.example.backend.model.Notifikasi;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotifikasiRepository extends JpaRepository<Notifikasi, Long> {
    List<Notifikasi> findByUser(User user);
    List<Notifikasi> findByStatus(String status);
}
