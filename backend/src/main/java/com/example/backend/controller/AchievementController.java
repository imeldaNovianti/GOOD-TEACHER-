package com.example.backend.controller;

import com.example.backend.model.Achievement;
import com.example.backend.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public List<Achievement> getAll() {
        return achievementService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Achievement> getById(@PathVariable Long id) {
        return achievementService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Achievement create(@RequestBody Achievement achievement) {
        return achievementService.create(achievement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Achievement> update(@PathVariable Long id, @RequestBody Achievement achievement) {
        try {
            return ResponseEntity.ok(achievementService.update(id, achievement));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        achievementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
