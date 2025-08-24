package com.example.backend.service;

import com.example.backend.model.Pertanyaan;
import com.example.backend.repository.PertanyaanRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PertanyaanService {

    private final PertanyaanRepository pertanyaanRepository;

    public PertanyaanService(PertanyaanRepository pertanyaanRepository) {
        this.pertanyaanRepository = pertanyaanRepository;
    }

    public List<Pertanyaan> getAll() {
        return pertanyaanRepository.findAll();
    }

    public Optional<Pertanyaan> getById(Long id) {
        return pertanyaanRepository.findById(id);
    }

    public Pertanyaan create(Pertanyaan pertanyaan) {
        return pertanyaanRepository.save(pertanyaan);
    }

    public Pertanyaan update(Long id, Pertanyaan pertanyaanDetails) {
        return pertanyaanRepository.findById(id)
                .map(pertanyaan -> {
                    pertanyaan.setTeks(pertanyaanDetails.getTeks());
                    pertanyaan.setTipeJawaban(pertanyaanDetails.getTipeJawaban());
                    return pertanyaanRepository.save(pertanyaan);
                })
                .orElseThrow(() -> new RuntimeException("Pertanyaan not found with id " + id));
    }

    public void delete(Long id) {
        pertanyaanRepository.deleteById(id);
    }

    public List<Pertanyaan> getByTipeJawaban(String tipeJawaban) {
        return pertanyaanRepository.findByTipeJawaban(tipeJawaban);
    }

    public List<Pertanyaan> searchByTeks(String keyword) {
        return pertanyaanRepository.findByTeksContainingIgnoreCase(keyword);
    }
}
