package com.example.backend.service;

import com.example.backend.model.Siswa;
import com.example.backend.repository.SiswaRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SiswaService {
    private final SiswaRepository repo;
    public SiswaService(SiswaRepository repo) { this.repo = repo; }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = (direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());
        return PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    }

    public Page<Siswa> list(String searchNama, String searchNim, Long jurusanId, int page, int size, String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);
        if (jurusanId != null) return repo.findByJurusan_Id(jurusanId, p);
        if (searchNim != null && !searchNim.isBlank()) return repo.findByNimContainingIgnoreCase(searchNim, p);
        if (searchNama != null && !searchNama.isBlank()) return repo.findByNamaContainingIgnoreCase(searchNama, p);
        return repo.findAll(p);
    }

    public Siswa save(Siswa s){ return repo.save(s);}
    public Siswa get(Long id){ return repo.findById(id).orElseThrow();}
    public Siswa update(Long id, Siswa s){
        Siswa e = get(id);
        e.setNama(s.getNama());
        e.setNim(s.getNim());
        e.setJurusan(s.getJurusan());
        return repo.save(e);
    }
    public void delete(Long id){ repo.deleteById(id); }
}
