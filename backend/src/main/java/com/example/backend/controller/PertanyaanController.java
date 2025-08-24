package com.example.backend.controller;

import com.example.backend.model.Pertanyaan;
import com.example.backend.service.PertanyaanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pertanyaan")
public class PertanyaanController {

    private final PertanyaanService pertanyaanService;

    public PertanyaanController(PertanyaanService pertanyaanService) {
        this.pertanyaanService = pertanyaanService;
    }

    // GET all
    @GetMapping
    public List<Pertanyaan> getAll() {
        return pertanyaanService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Pertanyaan> getById(@PathVariable Long id) {
        return pertanyaanService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public Pertanyaan create(@RequestBody Pertanyaan pertanyaan) {
        return pertanyaanService.create(pertanyaan);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Pertanyaan> update(@PathVariable Long id, @RequestBody Pertanyaan pertanyaanDetails) {
        try {
            return ResponseEntity.ok(pertanyaanService.update(id, pertanyaanDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pertanyaanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET by tipeJawaban (SKALA / TEKS)
    @GetMapping("/tipe/{tipeJawaban}")
    public List<Pertanyaan> getByTipeJawaban(@PathVariable String tipeJawaban) {
        return pertanyaanService.getByTipeJawaban(tipeJawaban);
    }

    // SEARCH by teks pertanyaan
    @GetMapping("/search")
    public List<Pertanyaan> searchByTeks(@RequestParam String keyword) {
        return pertanyaanService.searchByTeks(keyword);
    }
}
