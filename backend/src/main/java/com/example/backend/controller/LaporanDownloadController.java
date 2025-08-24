package com.example.backend.controller;

import com.example.backend.model.LaporanDownload;
import com.example.backend.service.LaporanDownloadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laporan-download")
public class LaporanDownloadController {

    private final LaporanDownloadService laporanDownloadService;

    public LaporanDownloadController(LaporanDownloadService laporanDownloadService) {
        this.laporanDownloadService = laporanDownloadService;
    }

    // GET all
    @GetMapping
    public List<LaporanDownload> getAll() {
        return laporanDownloadService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<LaporanDownload> getById(@PathVariable Long id) {
        return laporanDownloadService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public LaporanDownload create(@RequestBody LaporanDownload laporanDownload) {
        return laporanDownloadService.create(laporanDownload);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<LaporanDownload> update(@PathVariable Long id, @RequestBody LaporanDownload laporanDownloadDetails) {
        try {
            return ResponseEntity.ok(laporanDownloadService.update(id, laporanDownloadDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        laporanDownloadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
