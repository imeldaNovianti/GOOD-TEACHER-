package com.example.backend.service;

import com.example.backend.model.Fakultas;
import com.example.backend.repository.FakultasRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FakultasService {
    private final FakultasRepository repo;
    public FakultasService(FakultasRepository repo) { this.repo = repo; }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = (direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());
        return PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    }

    public Page<Fakultas> list(String search, int page, int size, String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);
        if (search != null && !search.isBlank()) return repo.findByNamaContainingIgnoreCase(search, p);
        return repo.findAll(p);
    }

    public Fakultas save(Fakultas f){ return repo.save(f); }
    public Fakultas get(Long id){ return repo.findById(id).orElseThrow(); }
    public Fakultas update(Long id, Fakultas f){
        Fakultas e = get(id);
        e.setNama(f.getNama());
        return repo.save(e);
    }
    public void delete(Long id){ repo.deleteById(id); }
}
