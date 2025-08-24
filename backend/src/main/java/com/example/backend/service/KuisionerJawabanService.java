package com.example.backend.service;

import com.example.backend.model.KuisionerJawaban;
import com.example.backend.model.GuruMapel;
import com.example.backend.model.Pertanyaan;
import com.example.backend.model.User;
import com.example.backend.repository.KuisionerJawabanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class KuisionerJawabanService {

    private final KuisionerJawabanRepository kuisionerJawabanRepository;

    public KuisionerJawabanService(KuisionerJawabanRepository kuisionerJawabanRepository) {
        this.kuisionerJawabanRepository = kuisionerJawabanRepository;
    }

    public List<KuisionerJawaban> getAll() {
        return kuisionerJawabanRepository.findAll();
    }

    public Optional<KuisionerJawaban> getById(Long id) {
        return kuisionerJawabanRepository.findById(id);
    }

    public KuisionerJawaban create(KuisionerJawaban jawaban) {
        jawaban.setCreatedAt(LocalDateTime.now());
        return kuisionerJawabanRepository.save(jawaban);
    }

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

    public void delete(Long id) {
        kuisionerJawabanRepository.deleteById(id);
    }

    public List<KuisionerJawaban> getBySiswa(User siswa) {
        return kuisionerJawabanRepository.findBySiswa(siswa);
    }

    public List<KuisionerJawaban> getBySiswaId(Long siswaId) {
        User siswa = new User();
        siswa.setId(siswaId);
        return kuisionerJawabanRepository.findBySiswa(siswa);
    }

    public List<KuisionerJawaban> getByGuruMapel(GuruMapel guruMapel) {
        return kuisionerJawabanRepository.findByGuruMapel(guruMapel);
    }

    public List<KuisionerJawaban> getByPertanyaan(Pertanyaan pertanyaan) {
        return kuisionerJawabanRepository.findByPertanyaan(pertanyaan);
    }

    // ✅ Tambahan untuk simpan banyak jawaban sekaligus
    public void saveAll(List<KuisionerJawaban> jawabanList) {
        jawabanList.forEach(j -> j.setCreatedAt(LocalDateTime.now()));
        kuisionerJawabanRepository.saveAll(jawabanList);
    }

    // ✅ Statistik rata-rata per guru
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
}
