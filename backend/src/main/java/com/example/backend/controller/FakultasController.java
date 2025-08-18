package com.example.backend.controller;

import com.example.backend.model.Fakultas;
import com.example.backend.service.FakultasService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fakultas")
public class FakultasController {
    private final FakultasService service;
    public FakultasController(FakultasService service) { this.service = service; }

    @GetMapping
    public Page<Fakultas> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nama") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        return service.list(search, page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public Fakultas get(@PathVariable Long id){ return service.get(id); }

    @PostMapping
    public ResponseEntity<Fakultas> create(@RequestBody Fakultas f){
        return ResponseEntity.ok(service.save(f));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fakultas> update(@PathVariable Long id, @RequestBody Fakultas f){
        return ResponseEntity.ok(service.update(id, f));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
