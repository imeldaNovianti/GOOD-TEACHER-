package com.example.backend.service;

import com.example.backend.model.Kuisioner;
import com.example.backend.repository.KuisionerRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KuisionerService {
    private final KuisionerRepository repo;

    public KuisionerService(KuisionerRepository repo) {
        this.repo = repo;
    }

    // Membuat pageable dengan sort dinamis
    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(Math.max(page, 0), Math.max(size, 1), sort);
    }

    // ✅ List Kuisioner (paging + sorting + search by judul)
    public Page<Kuisioner> list(String search, int page, int size, String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);

        if (search != null && !search.isBlank()) {
            return repo.findByJudulContainingIgnoreCase(search, p);
        }
        return repo.findAll(p);
    }

    // ✅ CRUD
    public Kuisioner save(Kuisioner k) {
        return repo.save(k);
    }

    public Kuisioner get(Long id) {
        return repo.findById(id).orElseThrow(
                () -> new RuntimeException("Kuisioner dengan id " + id + " tidak ditemukan")
        );
    }

    public Kuisioner update(Long id, Kuisioner k) {
        Kuisioner e = get(id);
        e.setJudul(k.getJudul());
        return repo.save(e);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Kuisioner dengan id " + id + " tidak ditemukan");
        }
        repo.deleteById(id);
    }
}
