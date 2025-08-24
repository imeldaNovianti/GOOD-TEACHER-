package com.example.backend.controller;

import com.example.backend.model.GuruMapel;
import com.example.backend.service.GuruMapelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guru-mapel")
public class GuruMapelController {

    private final GuruMapelService guruMapelService;

    public GuruMapelController(GuruMapelService guruMapelService) {
        this.guruMapelService = guruMapelService;
    }

    // GET all
    @GetMapping
    public List<GuruMapel> getAll() {
        return guruMapelService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<GuruMapel> getById(@PathVariable Long id) {
        return guruMapelService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public GuruMapel create(@RequestBody GuruMapel guruMapel) {
        return guruMapelService.create(guruMapel);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<GuruMapel> update(@PathVariable Long id, @RequestBody GuruMapel guruMapelDetails) {
        try {
            return ResponseEntity.ok(guruMapelService.update(id, guruMapelDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        guruMapelService.delete(id);
        return ResponseEntity.noContent().build(); // ✅ FIX: error hilang
    }

    // SEARCH by namaGuru
    @GetMapping("/search/nama")
    public List<GuruMapel> searchByNama(@RequestParam String keyword) {
        return guruMapelService.searchByNamaGuru(keyword);
    }

    // SEARCH by mataPelajaran
    @GetMapping("/search/mapel")
    public List<GuruMapel> searchByMapel(@RequestParam String keyword) {
        return guruMapelService.searchByMataPelajaran(keyword);
    }

    // SORT (by namaGuru / mataPelajaran)
    @GetMapping("/sort")
    public List<GuruMapel> sortByField(
            @RequestParam String by,
            @RequestParam(defaultValue = "asc") String direction) {
        return guruMapelService.sortByField(by, direction);
    }
}
