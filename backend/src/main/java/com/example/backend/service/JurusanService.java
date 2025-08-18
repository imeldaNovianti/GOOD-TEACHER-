package com.example.backend.service;

import com.example.backend.model.Jurusan;
import com.example.backend.repository.JurusanRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class JurusanService {
    private final JurusanRepository repo;

    public JurusanService(JurusanRepository repo) {
        this.repo = repo;
    }

    // Membuat Pageable dengan sort dinamis
    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(Math.max(page, 0), Math.max(size, 1), sort);
    }

    // ✅ List Jurusan dengan optional search & filter fakultas
    public Page<Jurusan> list(String search, Long fakultasId,
                              int page, int size,
                              String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);

        if (fakultasId != null) {
            return repo.findByFakultas_Id(fakultasId, p);
        }
        if (search != null && !search.isBlank()) {
            return repo.findByNamaContainingIgnoreCase(search, p);
        }
        return repo.findAll(p);
    }

    // ✅ CRUD
    public Jurusan save(Jurusan j) {
        return repo.save(j);
    }

    public Jurusan get(Long id) {
        return repo.findById(id).orElseThrow(
                () -> new RuntimeException("Jurusan dengan id " + id + " tidak ditemukan")
        );
    }

    public Jurusan update(Long id, Jurusan j) {
        Jurusan e = get(id);
        e.setNama(j.getNama());
        e.setFakultas(j.getFakultas());
        return repo.save(e);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Jurusan dengan id " + id + " tidak ditemukan");
        }
        repo.deleteById(id);
    }
}
