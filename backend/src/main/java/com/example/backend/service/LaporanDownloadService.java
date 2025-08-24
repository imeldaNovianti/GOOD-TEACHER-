package com.example.backend.service;

import com.example.backend.model.LaporanDownload;
import com.example.backend.repository.LaporanDownloadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LaporanDownloadService {

    private final LaporanDownloadRepository laporanDownloadRepository;

    public LaporanDownloadService(LaporanDownloadRepository laporanDownloadRepository) {
        this.laporanDownloadRepository = laporanDownloadRepository;
    }

    public List<LaporanDownload> getAll() {
        return laporanDownloadRepository.findAll();
    }

    public Optional<LaporanDownload> getById(Long id) {
        return laporanDownloadRepository.findById(id);
    }

    public LaporanDownload create(LaporanDownload laporanDownload) {
        return laporanDownloadRepository.save(laporanDownload);
    }

    public LaporanDownload update(Long id, LaporanDownload laporanDownloadDetails) {
        return laporanDownloadRepository.findById(id)
                .map(laporan -> {
                    laporan.setFilePath(laporanDownloadDetails.getFilePath());
                    laporan.setCreatedAt(laporanDownloadDetails.getCreatedAt());
                    laporan.setAdmin(laporanDownloadDetails.getAdmin());
                    laporan.setGuruMapel(laporanDownloadDetails.getGuruMapel());
                    laporan.setPeriode(laporanDownloadDetails.getPeriode());
                    return laporanDownloadRepository.save(laporan);
                })
                .orElseThrow(() -> new RuntimeException("LaporanDownload not found with id " + id));
    }

    public void delete(Long id) {
        laporanDownloadRepository.deleteById(id);
    }
}
