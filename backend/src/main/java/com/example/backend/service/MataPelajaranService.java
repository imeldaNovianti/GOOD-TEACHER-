package com.example.backend.service;

import com.example.backend.model.MataPelajaran;
import com.example.backend.repository.MataPelajaranRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MataPelajaranService {
    private final MataPelajaranRepository repo;

    public MataPelajaranService(MataPelajaranRepository repo) {
        this.repo = repo;
    }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(Math.max(page,0), Math.max(size,1), sort);
    }

    public Page<MataPelajaran> list(String search, Long jurusanId, int page, int size, String sortBy, String direction) {
        Pageable p = pageable(page, size, sortBy, direction);

        if (jurusanId != null) return repo.findByJurusan_Id(jurusanId, p);
        if (search != null && !search.isBlank()) return repo.findByNamaContainingIgnoreCase(search, p);

        return repo.findAll(p);
    }

    public MataPelajaran save(MataPelajaran mp) {
        return repo.save(mp);
    }

    public MataPelajaran get(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public MataPelajaran update(Long id, MataPelajaran mp) {
        MataPelajaran e = get(id);
        e.setNama(mp.getNama());
        e.setJurusan(mp.getJurusan());
        return repo.save(e);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
