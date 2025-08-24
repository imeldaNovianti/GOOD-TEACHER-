package com.example.backend.service;

import com.example.backend.model.GuruMapel;
import com.example.backend.repository.GuruMapelRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuruMapelService {

    private final GuruMapelRepository guruMapelRepository;

    public GuruMapelService(GuruMapelRepository guruMapelRepository) {
        this.guruMapelRepository = guruMapelRepository;
    }

    public List<GuruMapel> getAll() {
        return guruMapelRepository.findAll();
    }

    public Optional<GuruMapel> getById(Long id) {
        return guruMapelRepository.findById(id);
    }

    public GuruMapel create(GuruMapel guruMapel) {
        return guruMapelRepository.save(guruMapel);
    }

    public GuruMapel update(Long id, GuruMapel guruMapelDetails) {
        return guruMapelRepository.findById(id)
                .map(guruMapel -> {
                    guruMapel.setNamaGuru(guruMapelDetails.getNamaGuru());
                    guruMapel.setMataPelajaran(guruMapelDetails.getMataPelajaran());
                    return guruMapelRepository.save(guruMapel);
                })
                .orElseThrow(() -> new RuntimeException("GuruMapel not found with id " + id));
    }

    public void delete(Long id) {
        guruMapelRepository.deleteById(id);
    }

    public List<GuruMapel> searchByNamaGuru(String keyword) {
        return guruMapelRepository.findByNamaGuruContainingIgnoreCase(keyword);
    }

    public List<GuruMapel> searchByMataPelajaran(String keyword) {
        return guruMapelRepository.findByMataPelajaranContainingIgnoreCase(keyword);
    }

    public List<GuruMapel> sortByField(String field, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(field).descending() : Sort.by(field).ascending();
        return guruMapelRepository.findAll(sort);
    }
}
