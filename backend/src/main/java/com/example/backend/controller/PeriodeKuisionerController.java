package com.example.backend.controller;

import com.example.backend.model.PeriodeKuisioner;
import com.example.backend.service.PeriodeKuisionerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periode-kuisioner")
public class PeriodeKuisionerController {

    private final PeriodeKuisionerService periodeService;

    public PeriodeKuisionerController(PeriodeKuisionerService periodeService) {
        this.periodeService = periodeService;
    }

    // GET all
    @GetMapping
    public List<PeriodeKuisioner> getAll() {
        return periodeService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<PeriodeKuisioner> getById(@PathVariable Long id) {
        return periodeService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public PeriodeKuisioner create(@RequestBody PeriodeKuisioner periode) {
        return periodeService.create(periode);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<PeriodeKuisioner> update(@PathVariable Long id, @RequestBody PeriodeKuisioner periodeDetails) {
        try {
            return ResponseEntity.ok(periodeService.update(id, periodeDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        periodeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET by status
    @GetMapping("/status/{status}")
    public List<PeriodeKuisioner> getByStatus(@PathVariable String status) {
        return periodeService.getByStatus(status);
    }
}
