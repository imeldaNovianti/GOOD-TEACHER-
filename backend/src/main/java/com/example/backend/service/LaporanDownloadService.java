package com.example.backend.service;

import com.example.backend.model.LaporanDownload;
import com.example.backend.repository.LaporanDownloadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LaporanDownloadService {

    private final LaporanDownloadRepository laporanDownloadRepository;

    // Constructor untuk dependency injection
    public LaporanDownloadService(LaporanDownloadRepository laporanDownloadRepository) {
        this.laporanDownloadRepository = laporanDownloadRepository;
    }

    // Mengambil semua laporan download
    public List<LaporanDownload> getAll() {
        return laporanDownloadRepository.findAll();
    }

    // Mengambil laporan download berdasarkan ID
    public Optional<LaporanDownload> getById(Long id) {
        return laporanDownloadRepository.findById(id);
    }

    // Membuat laporan download baru dan menyimpannya
    public LaporanDownload create(LaporanDownload laporanDownload) {
        return laporanDownloadRepository.save(laporanDownload);
    }

    // Memperbarui laporan download berdasarkan ID
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

    // Menghapus laporan download berdasarkan ID
    public void delete(Long id) {
        laporanDownloadRepository.deleteById(id);
    }
}
