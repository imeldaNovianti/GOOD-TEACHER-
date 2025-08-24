package com.example.backend.service;

import com.example.backend.model.Notifikasi;
import com.example.backend.model.User;
import com.example.backend.repository.NotifikasiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotifikasiService {

    private final NotifikasiRepository notifikasiRepository;

    public NotifikasiService(NotifikasiRepository notifikasiRepository) {
        this.notifikasiRepository = notifikasiRepository;
    }

    public List<Notifikasi> getAll() {
        return notifikasiRepository.findAll();
    }

    public Optional<Notifikasi> getById(Long id) {
        return notifikasiRepository.findById(id);
    }

    public Notifikasi create(Notifikasi notifikasi) {
        return notifikasiRepository.save(notifikasi);
    }

    public Notifikasi update(Long id, Notifikasi notifikasiDetails) {
        return notifikasiRepository.findById(id)
                .map(notifikasi -> {
                    notifikasi.setPesan(notifikasiDetails.getPesan());
                    notifikasi.setStatus(notifikasiDetails.getStatus());
                    notifikasi.setCreatedAt(notifikasiDetails.getCreatedAt());
                    notifikasi.setUser(notifikasiDetails.getUser());
                    return notifikasiRepository.save(notifikasi);
                })
                .orElseThrow(() -> new RuntimeException("Notifikasi not found with id " + id));
    }

    public void delete(Long id) {
        notifikasiRepository.deleteById(id);
    }

    public List<Notifikasi> getByUser(User user) {
        return notifikasiRepository.findByUser(user);
    }

    public List<Notifikasi> getByStatus(String status) {
        return notifikasiRepository.findByStatus(status);
    }
}
