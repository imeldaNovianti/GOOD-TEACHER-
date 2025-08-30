package com.example.backend.service; // Menentukan package untuk service ini

import com.example.backend.model.GuruMapel; // Mengimpor model GuruMapel
import com.example.backend.repository.GuruMapelRepository; // Mengimpor repository GuruMapel
import org.springframework.data.domain.Sort; // Mengimpor Sort untuk pengurutan data
import org.springframework.stereotype.Service; // Mengimpor anotasi Service

import java.util.List; // Mengimpor List untuk pengembalian banyak data
import java.util.Optional; // Mengimpor Optional untuk pengecekan data yang bisa ada atau tidak

@Service // Menandakan bahwa kelas ini adalah service yang dikelola oleh Spring
public class GuruMapelService {

    private final GuruMapelRepository guruMapelRepository; // Mendeklarasikan repository GuruMapel

    // Constructor injection untuk repository GuruMapel
    public GuruMapelService(GuruMapelRepository guruMapelRepository) {
        this.guruMapelRepository = guruMapelRepository;
    }

    // =====================================
    // Mengambil semua guru mapel
    // =====================================
    public List<GuruMapel> getAll() {
        // Mengambil semua guru mapel dari database
        return guruMapelRepository.findAll();
    }

    // =====================================
    // Mengambil guru mapel berdasarkan ID
    // =====================================
    public Optional<GuruMapel> getById(Long id) {
        // Mencari guru mapel berdasarkan ID
        return guruMapelRepository.findById(id);
    }

    // =====================================
    // Membuat guru mapel baru
    // =====================================
    public GuruMapel create(GuruMapel guruMapel) {
        // Menyimpan guru mapel baru ke database
        return guruMapelRepository.save(guruMapel);
    }

    // =====================================
    // Memperbarui data guru mapel
    // =====================================
    public GuruMapel update(Long id, GuruMapel guruMapelDetails) {
        // Mencari guru mapel berdasarkan ID dan mengupdate datanya
        return guruMapelRepository.findById(id)
                .map(guruMapel -> {
                    guruMapel.setNamaGuru(guruMapelDetails.getNamaGuru());
                    guruMapel.setMataPelajaran(guruMapelDetails.getMataPelajaran());
                    // Menyimpan perubahan data guru mapel dan mengembalikannya
                    return guruMapelRepository.save(guruMapel);
                })
                .orElseThrow(() -> new RuntimeException("GuruMapel not found with id " + id));
    }

    // =====================================
    // Menghapus guru mapel berdasarkan ID
    // =====================================
    public void delete(Long id) {
        // Menghapus guru mapel berdasarkan ID
        guruMapelRepository.deleteById(id);
    }

    // =====================================
    // Mencari guru mapel berdasarkan nama guru
    // =====================================
    public List<GuruMapel> searchByNamaGuru(String keyword) {
        // Mencari guru mapel berdasarkan nama guru dengan keyword pencarian
        return guruMapelRepository.findByNamaGuruContainingIgnoreCase(keyword);
    }

    // =====================================
    // Mencari guru mapel berdasarkan mata pelajaran
    // =====================================
    public List<GuruMapel> searchByMataPelajaran(String keyword) {
        // Mencari guru mapel berdasarkan mata pelajaran dengan keyword pencarian
        return guruMapelRepository.findByMataPelajaranContainingIgnoreCase(keyword);
    }

    // =====================================
    // Mengurutkan data guru mapel berdasarkan field tertentu
    // =====================================
    public List<GuruMapel> sortByField(String field, String direction) {
        // Mengurutkan data guru mapel berdasarkan field dan arah pengurutan
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(field).descending() : Sort.by(field).ascending();
        return guruMapelRepository.findAll(sort);
    }
}
