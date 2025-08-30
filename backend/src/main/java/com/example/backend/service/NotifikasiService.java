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

    // Mengambil semua notifikasi
    public List<Notifikasi> getAll() {
        return notifikasiRepository.findAll();
    }

    // Mengambil notifikasi berdasarkan ID
    public Optional<Notifikasi> getById(Long id) {
        return notifikasiRepository.findById(id);
    }

    // Membuat notifikasi baru dan menyimpannya
    public Notifikasi create(Notifikasi notifikasi) {
        return notifikasiRepository.save(notifikasi);
    }

    // Memperbarui notifikasi berdasarkan ID
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

    // Menghapus notifikasi berdasarkan ID
    public void delete(Long id) {
        notifikasiRepository.deleteById(id);
    }

    // Mendapatkan notifikasi berdasarkan user
    public List<Notifikasi> getByUser(User user) {
        return notifikasiRepository.findByUser(user);
    }

    // Mendapatkan notifikasi berdasarkan status
    public List<Notifikasi> getByStatus(String status) {
        return notifikasiRepository.findByStatus(status);
    }
}
