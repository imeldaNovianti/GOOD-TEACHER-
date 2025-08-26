package com.example.backend.controller;

import com.example.backend.model.Achievement;
import com.example.backend.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:5173") // hanya frontend
public class AchievementController {

    private final AchievementService service;

    public AchievementController(AchievementService service) {
        this.service = service;
    }

    // GET semua achievement milik user tertentu (siswa login)
    @GetMapping("/{userId}")
    public ResponseEntity<List<Achievement>> getUserAchievements(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Achievement> achievements = service.getUserAchievements(userId);
        if (achievements.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(achievements);
    }

    // GET + cek otomatis (bisa dipanggil dari FE)
    @GetMapping("/check/{userId}")
    public ResponseEntity<List<Achievement>> checkAndGet(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Achievement> achievements = service.getUserAchievements(userId);
        if (achievements.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(achievements);
    }

    // POST tambah achievement untuk user
    @PostMapping("/{userId}")
    public ResponseEntity<Achievement> addAchievement(
            @PathVariable Long userId,
            @RequestBody Achievement achievement
    ) {
        if (userId == null || achievement == null) {
            return ResponseEntity.badRequest().build();
        }

        Achievement saved = service.addAchievement(userId, achievement);
        return ResponseEntity.ok(saved);
    }

    // PUT update status achievement (unlock/lock)
    @PutMapping("/{achievementId}")
    public ResponseEntity<Achievement> updateAchievement(
            @PathVariable Long achievementId,
            @RequestParam boolean unlocked
    ) {
        try {
            Achievement updated = service.updateAchievement(achievementId, unlocked);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
