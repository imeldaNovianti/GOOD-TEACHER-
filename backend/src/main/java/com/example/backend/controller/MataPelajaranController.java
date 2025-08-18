package com.example.backend.controller;

import com.example.backend.model.MataPelajaran;
import com.example.backend.service.MataPelajaranService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mata-pelajaran")
public class MataPelajaranController {

    private final MataPelajaranService service;

    public MataPelajaranController(MataPelajaranService service) {
        this.service = service;
    }

    @GetMapping
    public Page<MataPelajaran> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long jurusanId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return service.list(search, jurusanId, page, size, sortBy, direction);
    }

    @PostMapping
    public MataPelajaran create(@RequestBody MataPelajaran mp) {
        return service.save(mp);
    }

    @GetMapping("/{id}")
    public MataPelajaran get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public MataPelajaran update(@PathVariable Long id, @RequestBody MataPelajaran mp) {
        return service.update(id, mp);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
