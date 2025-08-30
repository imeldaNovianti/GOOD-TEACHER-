package com.example.backend.service; // Menentukan package untuk service ini

import com.example.backend.model.Achievement; // Mengimpor model Achievement
import com.example.backend.model.User; // Mengimpor model User
import com.example.backend.model.KuisionerJawaban; // Mengimpor model KuisionerJawaban
import com.example.backend.model.GuruMapel; // Mengimpor model GuruMapel
import com.example.backend.repository.AchievementRepository; // Mengimpor repository Achievement
import com.example.backend.repository.UserRepository; // Mengimpor repository User
import org.springframework.stereotype.Service; // Mengimpor anotasi Service

import java.util.List; // Mengimpor List untuk pengembalian banyak data

@Service // Menandakan bahwa kelas ini adalah service yang dikelola oleh Spring
public class AchievementService {

    private final AchievementRepository achievementRepo; // Repository untuk operasi CRUD pada Achievement
    private final UserRepository userRepo; // Repository untuk operasi CRUD pada User
    private final KuisionerJawabanService kuisionerService; // Service untuk mengelola jawaban kuisioner

    // Constructor injection untuk repository dan service
    public AchievementService(AchievementRepository achievementRepo,
                              UserRepository userRepo,
                              KuisionerJawabanService kuisionerService) {
        this.achievementRepo = achievementRepo;
        this.userRepo = userRepo;
        this.kuisionerService = kuisionerService;
    }

    // =====================================
    // Ambil semua achievement user
    // =====================================
    public List<Achievement> getUserAchievements(Long userId) {
        // Mencari user berdasarkan ID
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // Setiap kali ambil achievements, cek dan update status otomatis
        checkAndUnlockAchievements(user);

        // Mengembalikan daftar achievement yang dimiliki user
        return achievementRepo.findByUser(user);
    }

    // =====================================
    // Tambahkan achievement manual
    // =====================================
    public Achievement addAchievement(Long userId, Achievement achievement) {
        // Mencari user berdasarkan ID
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        
        // Menetapkan achievement untuk user yang ditemukan
        achievement.setUser(user);
        
        // Menyimpan achievement ke database dan mengembalikannya
        return achievementRepo.save(achievement);
    }

    // =====================================
    // Update status achievement
    // =====================================
    public Achievement updateAchievement(Long achievementId, boolean unlocked) {
        // Mencari achievement berdasarkan ID
        Achievement ach = achievementRepo.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement tidak ditemukan"));
        
        // Mengupdate status achievement (terbuka atau terkunci)
        ach.setUnlocked(unlocked);
        
        // Menyimpan perubahan status achievement dan mengembalikannya
        return achievementRepo.save(ach);
    }

    // =====================================
    // 🔑 Logika auto unlock achievement
    // =====================================
    private void checkAndUnlockAchievements(User user) {
        // Ambil semua jawaban kuisioner yang telah diisi oleh siswa (user)
        List<KuisionerJawaban> jawaban = kuisionerService.getJawabanBySiswa(user.getId());

        // Ambil semua guru mapel yang tersedia untuk siswa
        List<GuruMapel> semuaGuru = kuisionerService.getAllGuru();

        // Hitung total jumlah pertanyaan yang harus dijawab oleh siswa
        int totalPertanyaan = kuisionerService.countTotalKuisioner();

        // Hitung jumlah guru yang sudah diisi setidaknya satu pertanyaan
        long guruTerisi = jawaban.stream()
                .map(j -> j.getGuruMapel().getId()) // Ambil ID guru dari setiap jawaban
                .distinct() // Hanya ambil ID guru yang unik
                .count(); // Hitung jumlah guru unik yang sudah diisi

        // Cek apakah semua guru sudah memiliki semua pertanyaan yang dijawab
        boolean allCompleted = semuaGuru.stream()
                .allMatch(guru -> jawaban.stream()
                        .filter(j -> j.getGuruMapel().getId().equals(guru.getId())) // Filter jawaban berdasarkan guru
                        .map(j -> j.getPertanyaan().getId()) // Ambil ID pertanyaan dari jawaban
                        .distinct() // Ambil ID pertanyaan yang unik
                        .count() == totalPertanyaan); // Cek apakah sudah dijawab semua pertanyaan untuk guru ini

        // 🔑 Unlock achievement sesuai logika yang sudah ditentukan
        unlockIfEligible(user, "Rookie", "Isi minimal satu guru", guruTerisi >= 1);
        unlockIfEligible(user, "Consistency", "Isi minimal setengah dari guru", guruTerisi >= Math.ceil(semuaGuru.size() / 2.0));
        unlockIfEligible(user, "All Completed", "Isi semua pertanyaan semua guru", allCompleted);
    }

    // =====================================
    // Method untuk unlock achievement jika memenuhi syarat
    // =====================================
    private void unlockIfEligible(User user, String title, String description, boolean eligible) {
        // Cek apakah achievement dengan judul tertentu sudah ada untuk user ini
        Achievement existing = achievementRepo.findByUser(user)
                .stream() // Mengubah daftar menjadi stream untuk filter
                .filter(a -> a.getTitle().equalsIgnoreCase(title)) // Filter berdasarkan judul achievement
                .findFirst() // Ambil achievement pertama yang cocok
                .orElse(null); // Jika tidak ditemukan, kembalikan null

        // Jika achievement belum ada, buat yang baru
        if (existing == null) {
            Achievement newAch = new Achievement(title, description, eligible, user); // Membuat achievement baru
            achievementRepo.save(newAch); // Menyimpan achievement baru ke database
        } 
        // Jika achievement sudah ada dan memenuhi syarat, update statusnya menjadi unlocked
        else if (eligible && !existing.isUnlocked()) {
            existing.setUnlocked(true); // Set status achievement menjadi unlocked
            achievementRepo.save(existing); // Simpan perubahan ke database
        }
    }
}
