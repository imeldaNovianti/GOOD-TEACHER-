package com.example.backend.service;

import com.example.backend.model.Pertanyaan;
import com.example.backend.repository.PertanyaanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PertanyaanService {
    private final PertanyaanRepository repo;

    public PertanyaanService(PertanyaanRepository repo) {
        this.repo = repo;
    }

    public List<Pertanyaan> listAll() {
        return repo.findAll();
    }

    public Pertanyaan save(Pertanyaan p) {
        return repo.save(p);
    }

    public Pertanyaan get(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Pertanyaan update(Long id, Pertanyaan p) {
        Pertanyaan existing = get(id);
        existing.setTeks(p.getTeks());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
