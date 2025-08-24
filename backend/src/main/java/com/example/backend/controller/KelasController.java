package com.example.backend.controller;

import com.example.backend.model.Kelas;
import com.example.backend.service.KelasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kelas")
public class KelasController {

    private final KelasService kelasService;

    public KelasController(KelasService kelasService) {
        this.kelasService = kelasService;
    }

    // GET all
    @GetMapping
    public List<Kelas> getAll() {
        return kelasService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Kelas> getById(@PathVariable Long id) {
        return kelasService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public Kelas create(@RequestBody Kelas kelas) {
        return kelasService.create(kelas);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Kelas> update(@PathVariable Long id, @RequestBody Kelas kelasDetails) {
        try {
            return ResponseEntity.ok(kelasService.update(id, kelasDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        kelasService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH by namaKelas
    @GetMapping("/search/nama")
    public List<Kelas> searchByNama(@RequestParam String keyword) {
        return kelasService.searchByNama(keyword);
    }

    // SEARCH by waliKelas
    @GetMapping("/search/wali")
    public List<Kelas> searchByWali(@RequestParam String keyword) {
        return kelasService.searchByWali(keyword);
    }

    // SORT (by namaKelas / waliKelas)
    @GetMapping("/sort")
    public List<Kelas> sortByField(
            @RequestParam String by,
            @RequestParam(defaultValue = "asc") String direction) {
        return kelasService.sortByField(by, direction);
    }
}
