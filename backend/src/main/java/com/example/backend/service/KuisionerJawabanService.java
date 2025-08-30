package com.example.backend.service;

import com.example.backend.model.KuisionerJawaban;
import com.example.backend.model.GuruMapel;
import com.example.backend.model.Pertanyaan;
import com.example.backend.model.User;
import com.example.backend.repository.KuisionerJawabanRepository;
import com.example.backend.repository.GuruMapelRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class KuisionerJawabanService {

    private final KuisionerJawabanRepository kuisionerJawabanRepository;
    private final GuruMapelRepository guruMapelRepository;

    public KuisionerJawabanService(KuisionerJawabanRepository kuisionerJawabanRepository,
                                   GuruMapelRepository guruMapelRepository) {
        this.kuisionerJawabanRepository = kuisionerJawabanRepository;
        this.guruMapelRepository = guruMapelRepository;
    }

    // ========================= CRUD =========================
    
    // Mengambil semua jawaban kuisioner
    public List<KuisionerJawaban> getAll() {
        return kuisionerJawabanRepository.findAll();
    }

    // Mengambil jawaban kuisioner berdasarkan ID
    public Optional<KuisionerJawaban> getById(Long id) {
        return kuisionerJawabanRepository.findById(id);
    }

    // Membuat jawaban kuisioner baru dan menyimpannya ke database
    public KuisionerJawaban create(KuisionerJawaban jawaban) {
        jawaban.setCreatedAt(LocalDateTime.now()); // Set waktu pembuatan
        return kuisionerJawabanRepository.save(jawaban);
    }

    // Memperbarui jawaban kuisioner berdasarkan ID
    public KuisionerJawaban update(Long id, KuisionerJawaban jawabanDetails) {
        return kuisionerJawabanRepository.findById(id)
                .map(jawaban -> {
                    jawaban.setSiswa(jawabanDetails.getSiswa());
                    jawaban.setGuruMapel(jawabanDetails.getGuruMapel());
                    jawaban.setPertanyaan(jawabanDetails.getPertanyaan());
                    jawaban.setJawaban(jawabanDetails.getJawaban());
                    return kuisionerJawabanRepository.save(jawaban);
                })
                .orElseThrow(() -> new RuntimeException("KuisionerJawaban not found with id " + id));
    }

    // Menghapus jawaban kuisioner berdasarkan ID
    public void delete(Long id) {
        kuisionerJawabanRepository.deleteById(id);
    }

    // ========================= QUERY PER USER / GURU =========================
    
    // Mendapatkan jawaban kuisioner berdasarkan siswa
    public List<KuisionerJawaban> getBySiswa(User siswa) {
        return kuisionerJawabanRepository.findBySiswa(siswa);
    }

    // Mendapatkan jawaban kuisioner berdasarkan ID siswa
    public List<KuisionerJawaban> getBySiswaId(Long siswaId) {
        User siswa = new User();
        siswa.setId(siswaId);
        return kuisionerJawabanRepository.findBySiswa(siswa);
    }

    // Dipakai di AchievementService untuk mendapatkan jawaban siswa
    public List<KuisionerJawaban> getJawabanBySiswa(Long siswaId) {
        User siswa = new User();
        siswa.setId(siswaId);
        return kuisionerJawabanRepository.findBySiswa(siswa);
    }

    // Mendapatkan jawaban kuisioner berdasarkan guru mapel
    public List<KuisionerJawaban> getByGuruMapel(GuruMapel guruMapel) {
        return kuisionerJawabanRepository.findByGuruMapel(guruMapel);
    }

    // Mendapatkan jawaban kuisioner berdasarkan pertanyaan
    public List<KuisionerJawaban> getByPertanyaan(Pertanyaan pertanyaan) {
        return kuisionerJawabanRepository.findByPertanyaan(pertanyaan);
    }

    // ========================= SIMPAN BANYAK JAWABAN =========================
    
    // Menyimpan banyak jawaban kuisioner sekaligus
    public void saveAll(List<KuisionerJawaban> jawabanList) {
        jawabanList.forEach(j -> j.setCreatedAt(LocalDateTime.now())); // Set waktu pembuatan
        kuisionerJawabanRepository.saveAll(jawabanList);
    }

    // ========================= STATISTIK =========================
    
    // Mendapatkan rata-rata jawaban per guru
    public List<Map<String, Object>> getRataRataPerGuru() {
        List<Object[]> result = kuisionerJawabanRepository.getRataRataPerGuru();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Object[] row : result) {
            Map<String, Object> map = new HashMap<>();
            map.put("guru", row[0]);
            map.put("mapel", row[1]);
            map.put("rataRata", row[2]);
            response.add(map);
        }
        return response;
    }

    // ========================= HITUNGAN =========================
    
    // Menghitung jumlah jawaban kuisioner per siswa
    public int countBySiswa(Long siswaId) {
        User siswa = new User();
        siswa.setId(siswaId);
        return kuisionerJawabanRepository.findBySiswa(siswa).size();
    }

    // Menghitung total kuisioner yang ada
    public int countTotalKuisioner() {
        return (int) kuisionerJawabanRepository.findAll()
                .stream()
                .map(j -> j.getPertanyaan().getId())
                .distinct()
                .count();
    }

    // Mendapatkan semua guru mapel
    public List<GuruMapel> getAllGuru() {
        return guruMapelRepository.findAll();
    }

    // ========================= VALIDASI =========================
    
    // Mengecek apakah ada jawaban kuisioner dari siswa dengan guru mapel tertentu
    public boolean existsBySiswaIdAndGuruId(Long siswaId, Long guruId) {
        return kuisionerJawabanRepository.existsBySiswaIdAndGuruMapelId(siswaId, guruId);
    }
}
