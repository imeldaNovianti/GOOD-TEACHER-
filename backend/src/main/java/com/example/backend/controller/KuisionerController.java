package com.example.backend.controller;

import com.example.backend.model.Kuisioner;
import com.example.backend.service.KuisionerService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kuisioner")
public class KuisionerController {

    private final KuisionerService service;

    public KuisionerController(KuisionerService service) {
        this.service = service;
    }

    // ✅ GET all dengan paging, sorting, search
    @GetMapping
    public Page<Kuisioner> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return service.list(search, page, size, sortBy, direction);
    }

    // ✅ GET by ID
    @GetMapping("/{id}")
    public Kuisioner getById(@PathVariable Long id) {
        return service.get(id);
    }

    // ✅ CREATE
    @PostMapping
    public Kuisioner create(@RequestBody Kuisioner kuisioner) {
        return service.save(kuisioner);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Kuisioner update(@PathVariable Long id, @RequestBody Kuisioner kuisioner) {
        return service.update(id, kuisioner);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
