package com.example.backend.service;

import com.example.backend.model.Achievement;
import com.example.backend.repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public AchievementService(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    public List<Achievement> getAll() {
        return achievementRepository.findAll();
    }

    public Optional<Achievement> getById(Long id) {
        return achievementRepository.findById(id);
    }

    public Achievement create(Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    public Achievement update(Long id, Achievement achievement) {
        return achievementRepository.findById(id)
                .map(existing -> {
                    existing.setNama(achievement.getNama());
                    existing.setDeskripsi(achievement.getDeskripsi());
                    existing.setTanggal(achievement.getTanggal());
                    existing.setSiswa(achievement.getSiswa());
                    return achievementRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Achievement not found with id " + id));
    }

    public void delete(Long id) {
        achievementRepository.deleteById(id);
    }
}
