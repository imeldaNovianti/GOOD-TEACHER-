package com.example.backend.service;

import com.example.backend.model.Achievement;
import com.example.backend.model.User;
import com.example.backend.model.KuisionerJawaban;
import com.example.backend.model.GuruMapel;
import com.example.backend.repository.AchievementRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepo;
    private final UserRepository userRepo;
    private final KuisionerJawabanService kuisionerService;

    public AchievementService(AchievementRepository achievementRepo,
                              UserRepository userRepo,
                              KuisionerJawabanService kuisionerService) {
        this.achievementRepo = achievementRepo;
        this.userRepo = userRepo;
        this.kuisionerService = kuisionerService;
    }

    // Ambil semua achievement user
    public List<Achievement> getUserAchievements(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // 🔥 setiap kali ambil, cek dan update status otomatis
        checkAndUnlockAchievements(user);

        return achievementRepo.findByUser(user);
    }

    // Tambahkan achievement manual
    public Achievement addAchievement(Long userId, Achievement achievement) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        achievement.setUser(user);
        return achievementRepo.save(achievement);
    }

    // Update status achievement
    public Achievement updateAchievement(Long achievementId, boolean unlocked) {
        Achievement ach = achievementRepo.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement tidak ditemukan"));
        ach.setUnlocked(unlocked);
        return achievementRepo.save(ach);
    }

    // =====================================
    // 🔑 Logika auto unlock achievement
    // =====================================
    private void checkAndUnlockAchievements(User user) {
        // Ambil semua jawaban siswa
        List<KuisionerJawaban> jawaban = kuisionerService.getJawabanBySiswa(user.getId());

        // Ambil semua guru
        List<GuruMapel> semuaGuru = kuisionerService.getAllGuru();

        // Ambil jumlah pertanyaan per guru
        int totalPertanyaan = kuisionerService.countTotalKuisioner();

        // Hitung jumlah guru unik yang sudah diisi setidaknya satu pertanyaan
        long guruTerisi = jawaban.stream()
                .map(j -> j.getGuruMapel().getId())
                .distinct()
                .count();

        // Cek semua guru sudah punya semua pertanyaan
        boolean allCompleted = semuaGuru.stream()
                .allMatch(guru -> jawaban.stream()
                        .filter(j -> j.getGuruMapel().getId().equals(guru.getId()))
                        .map(j -> j.getPertanyaan().getId())
                        .distinct()
                        .count() == totalPertanyaan);

        // 🔑 Unlock achievement sesuai logika
        unlockIfEligible(user, "Rookie", "Isi minimal satu guru", guruTerisi >= 1);
        unlockIfEligible(user, "Consistency", "Isi minimal setengah dari guru", guruTerisi >= Math.ceil(semuaGuru.size() / 2.0));
        unlockIfEligible(user, "All Completed", "Isi semua pertanyaan semua guru", allCompleted);
    }

    private void unlockIfEligible(User user, String title, String description, boolean eligible) {
        Achievement existing = achievementRepo.findByUser(user)
                .stream()
                .filter(a -> a.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElse(null);

        if (existing == null) {
            Achievement newAch = new Achievement(title, description, eligible, user);
            achievementRepo.save(newAch);
        } else if (eligible && !existing.isUnlocked()) {
            existing.setUnlocked(true);
            achievementRepo.save(existing);
        }
    }
}
