package com.example.backend.controller;

import com.example.backend.model.Notifikasi;
import com.example.backend.model.User;
import com.example.backend.service.NotifikasiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifikasi")
public class NotifikasiController {

    private final NotifikasiService notifikasiService;

    public NotifikasiController(NotifikasiService notifikasiService) {
        this.notifikasiService = notifikasiService;
    }

    // GET all
    @GetMapping
    public List<Notifikasi> getAll() {
        return notifikasiService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notifikasi> getById(@PathVariable Long id) {
        return notifikasiService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE
    @PostMapping
    public Notifikasi create(@RequestBody Notifikasi notifikasi) {
        return notifikasiService.create(notifikasi);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Notifikasi> update(@PathVariable Long id, @RequestBody Notifikasi notifikasiDetails) {
        try {
            return ResponseEntity.ok(notifikasiService.update(id, notifikasiDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notifikasiService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET by status
    @GetMapping("/status/{status}")
    public List<Notifikasi> getByStatus(@PathVariable String status) {
        return notifikasiService.getByStatus(status);
    }

    // GET by user id
    @GetMapping("/user/{userId}")
    public List<Notifikasi> getByUser(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return notifikasiService.getByUser(user);
    }
}
