package com.example.backend.service;

import com.example.backend.model.Guru;
import com.example.backend.repository.GuruRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GuruService {
    private final GuruRepository repo;
    public GuruService(GuruRepository repo) { this.repo = repo; }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = (direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());
        return PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    }

    public Page<Guru> list(String search, Long fakultasId, int page, int size, String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);
        if (fakultasId != null) return repo.findByFakultas_Id(fakultasId, p);
        if (search != null && !search.isBlank()) return repo.findByNamaContainingIgnoreCase(search, p);
        return repo.findAll(p);
        }
    public Guru save(Guru g){ return repo.save(g);}
    public Guru get(Long id){ return repo.findById(id).orElseThrow();}
    public Guru update(Long id, Guru g){
        Guru e = get(id);
        e.setNama(g.getNama());
        e.setEmail(g.getEmail());
        e.setFakultas(g.getFakultas());
        return repo.save(e);
    }
    public void delete(Long id){ repo.deleteById(id); }
}
