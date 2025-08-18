package com.example.backend.controller;

import com.example.backend.model.Pertanyaan;
import com.example.backend.service.PertanyaanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pertanyaan")
public class PertanyaanController {

    private final PertanyaanService service;

    public PertanyaanController(PertanyaanService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pertanyaan> getAllPertanyaan() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public Pertanyaan getPertanyaan(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    public Pertanyaan createPertanyaan(@RequestBody Pertanyaan p) {
        return service.save(p);
    }

    @PutMapping("/{id}")
    public Pertanyaan updatePertanyaan(@PathVariable Long id, @RequestBody Pertanyaan p) {
        return service.update(id, p);
    }

    @DeleteMapping("/{id}")
    public void deletePertanyaan(@PathVariable Long id) {
        service.delete(id);
    }
}
