package com.example.backend.service;

import com.example.backend.model.PeriodeKuisioner;
import com.example.backend.repository.PeriodeKuisionerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PeriodeKuisionerService {

    private final PeriodeKuisionerRepository periodeRepo;

    public PeriodeKuisionerService(PeriodeKuisionerRepository periodeRepo) {
        this.periodeRepo = periodeRepo;
    }

    public List<PeriodeKuisioner> getAll() {
        return periodeRepo.findAll();
    }

    public Optional<PeriodeKuisioner> getById(Long id) {
        return periodeRepo.findById(id);
    }

    public PeriodeKuisioner create(PeriodeKuisioner periode) {
        return periodeRepo.save(periode);
    }

    public PeriodeKuisioner update(Long id, PeriodeKuisioner periodeDetails) {
        return periodeRepo.findById(id)
                .map(periode -> {
                    periode.setNama(periodeDetails.getNama());
                    periode.setMulai(periodeDetails.getMulai());
                    periode.setSelesai(periodeDetails.getSelesai());
                    periode.setStatus(periodeDetails.getStatus());
                    return periodeRepo.save(periode);
                })
                .orElseThrow(() -> new RuntimeException("PeriodeKuisioner not found with id " + id));
    }

    public void delete(Long id) {
        periodeRepo.deleteById(id);
    }

    public List<PeriodeKuisioner> getByStatus(String status) {
        return periodeRepo.findByStatus(status);
    }
}
