package com.example.backend.service;

import com.example.backend.model.Kelas;
import com.example.backend.repository.KelasRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KelasService {

    private final KelasRepository kelasRepository;

    public KelasService(KelasRepository kelasRepository) {
        this.kelasRepository = kelasRepository;
    }

    public List<Kelas> getAll() {
        return kelasRepository.findAll();
    }

    public Optional<Kelas> getById(Long id) {
        return kelasRepository.findById(id);
    }

    public Kelas create(Kelas kelas) {
        return kelasRepository.save(kelas);
    }

    public Kelas update(Long id, Kelas kelasDetails) {
        return kelasRepository.findById(id)
                .map(kelas -> {
                    kelas.setNamaKelas(kelasDetails.getNamaKelas());
                    kelas.setWaliKelas(kelasDetails.getWaliKelas());
                    return kelasRepository.save(kelas);
                })
                .orElseThrow(() -> new RuntimeException("Kelas not found with id " + id));
    }

    public void delete(Long id) {
        kelasRepository.deleteById(id);
    }

    public List<Kelas> searchByNama(String keyword) {
        return kelasRepository.findByNamaKelasContainingIgnoreCase(keyword);
    }

    public List<Kelas> searchByWali(String keyword) {
        return kelasRepository.findByWaliKelasContainingIgnoreCase(keyword);
    }

    public List<Kelas> sortByField(String field, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(field).descending() : Sort.by(field).ascending();
        return kelasRepository.findAll(sort);
    }
}
