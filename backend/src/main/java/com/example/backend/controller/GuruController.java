package com.example.backend.controller;

import com.example.backend.model.Guru;
import com.example.backend.service.GuruService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guru")
public class GuruController {

    private final GuruService service;

    public GuruController(GuruService service) {
        this.service = service;
    }

    // ✅ Debug endpoint untuk cek apakah controller terdeteksi
    @GetMapping("/ping")
    public String ping() {
        return "GuruController is working!";
    }

    @GetMapping
    public Page<Guru> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long fakultasId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nama") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return service.list(search, fakultasId, page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public Guru get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<Guru> create(@RequestBody Guru g) {
        return ResponseEntity.ok(service.save(g));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Guru> update(@PathVariable Long id, @RequestBody Guru g) {
        return ResponseEntity.ok(service.update(id, g));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
