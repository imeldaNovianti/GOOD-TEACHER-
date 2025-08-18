package com.example.backend.controller;

import com.example.backend.model.Siswa;
import com.example.backend.service.SiswaService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/siswa")
public class SiswaController {
    private final SiswaService service;
    public SiswaController(SiswaService service) { this.service = service; }

    @GetMapping
    public Page<Siswa> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String searchNim,
            @RequestParam(required = false) Long jurusanId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nama") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        return service.list(search, searchNim, jurusanId, page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public Siswa get(@PathVariable Long id){ return service.get(id); }

    @PostMapping
    public ResponseEntity<Siswa> create(@RequestBody Siswa s){
        return ResponseEntity.ok(service.save(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Siswa> update(@PathVariable Long id, @RequestBody Siswa s){
        return ResponseEntity.ok(service.update(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
