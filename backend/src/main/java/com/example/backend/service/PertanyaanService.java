package com.example.backend.service;

import com.example.backend.model.Pertanyaan;
import com.example.backend.repository.PertanyaanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PertanyaanService {

    private final PertanyaanRepository pertanyaanRepository;

    // Constructor untuk dependency injection
    public PertanyaanService(PertanyaanRepository pertanyaanRepository) {
        this.pertanyaanRepository = pertanyaanRepository;
    }

    // Mengambil semua pertanyaan dari database
    public List<Pertanyaan> getAll() {
        return pertanyaanRepository.findAll();
    }

    // Mengambil pertanyaan berdasarkan ID
    public Optional<Pertanyaan> getById(Long id) {
        return pertanyaanRepository.findById(id);
    }

    // Membuat pertanyaan baru dan menyimpannya ke database
    public Pertanyaan create(Pertanyaan pertanyaan) {
        return pertanyaanRepository.save(pertanyaan);
    }

    // Memperbarui pertanyaan berdasarkan ID yang diberikan
    public Pertanyaan update(Long id, Pertanyaan pertanyaanDetails) {
        return pertanyaanRepository.findById(id)
                .map(pertanyaan -> {
                    // Memperbarui teks pertanyaan dan tipe jawaban
                    pertanyaan.setTeks(pertanyaanDetails.getTeks());
                    pertanyaan.setTipeJawaban(pertanyaanDetails.getTipeJawaban());
                    return pertanyaanRepository.save(pertanyaan); // Menyimpan perubahan
                })
                .orElseThrow(() -> new RuntimeException("Pertanyaan not found with id " + id)); // Jika tidak ditemukan, lempar exception
    }

    // Menghapus pertanyaan berdasarkan ID
    public void delete(Long id) {
        pertanyaanRepository.deleteById(id);
    }

    // Mengambil pertanyaan berdasarkan tipe jawaban (misal: multiple choice, teks, dll)
    public List<Pertanyaan> getByTipeJawaban(String tipeJawaban) {
        return pertanyaanRepository.findByTipeJawaban(tipeJawaban);
    }

    // Mencari pertanyaan berdasarkan teks yang diberikan
    public List<Pertanyaan> searchByTeks(String keyword) {
        return pertanyaanRepository.findByTeksContainingIgnoreCase(keyword); // Pencarian teks dengan mengabaikan besar kecil huruf
    }
}
