package com.example.backend.service; // Menentukan package untuk service ini

import com.example.backend.model.Kelas; // Mengimpor model Kelas
import com.example.backend.repository.KelasRepository; // Mengimpor repository Kelas
import org.springframework.data.domain.Sort; // Mengimpor Sort untuk pengurutan data
import org.springframework.stereotype.Service; // Mengimpor anotasi Service

import java.util.List; // Mengimpor List untuk pengembalian banyak data
import java.util.Optional; // Mengimpor Optional untuk pengecekan data yang bisa ada atau tidak

@Service // Menandakan bahwa kelas ini adalah service yang dikelola oleh Spring
public class KelasService {

    private final KelasRepository kelasRepository; // Mendeklarasikan repository Kelas

    // Constructor injection untuk repository Kelas
    public KelasService(KelasRepository kelasRepository) {
        this.kelasRepository = kelasRepository;
    }

    // =====================================
    // Mengambil semua kelas
    // =====================================
    public List<Kelas> getAll() {
        // Mengambil semua kelas dari database
        return kelasRepository.findAll();
    }

    // =====================================
    // Mengambil kelas berdasarkan ID
    // =====================================
    public Optional<Kelas> getById(Long id) {
        // Mencari kelas berdasarkan ID
        return kelasRepository.findById(id);
    }

    // =====================================
    // Membuat kelas baru
    // =====================================
    public Kelas create(Kelas kelas) {
        // Menyimpan kelas baru ke database
        return kelasRepository.save(kelas);
    }

    // =====================================
    // Memperbarui data kelas
    // =====================================
    public Kelas update(Long id, Kelas kelasDetails) {
        // Mencari kelas berdasarkan ID dan mengupdate datanya
        return kelasRepository.findById(id)
                .map(kelas -> {
                    kelas.setNamaKelas(kelasDetails.getNamaKelas());
                    kelas.setWaliKelas(kelasDetails.getWaliKelas());
                    // Menyimpan perubahan data kelas dan mengembalikannya
                    return kelasRepository.save(kelas);
                })
                .orElseThrow(() -> new RuntimeException("Kelas not found with id " + id));
    }

    // =====================================
    // Menghapus kelas berdasarkan ID
    // =====================================
    public void delete(Long id) {
        // Menghapus kelas berdasarkan ID
        kelasRepository.deleteById(id);
    }

    // =====================================
    // Mencari kelas berdasarkan nama
    // =====================================
    public List<Kelas> searchByNama(String keyword) {
        // Mencari kelas berdasarkan nama dengan keyword pencarian
        return kelasRepository.findByNamaKelasContainingIgnoreCase(keyword);
    }

    // =====================================
    // Mencari kelas berdasarkan wali kelas
    // =====================================
    public List<Kelas> searchByWali(String keyword) {
        // Mencari kelas berdasarkan wali kelas dengan keyword pencarian
        return kelasRepository.findByWaliKelasContainingIgnoreCase(keyword);
    }

    // =====================================
    // Mengurutkan data kelas berdasarkan field tertentu
    // =====================================
    public List<Kelas> sortByField(String field, String direction) {
        // Mengurutkan data kelas berdasarkan field dan arah pengurutan
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(field).descending() : Sort.by(field).ascending();
        return kelasRepository.findAll(sort);
    }
}
