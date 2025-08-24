package com.example.backend.controller;

import com.example.backend.model.KuisionerJawaban;
import com.example.backend.service.KuisionerJawabanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kuisioner-jawaban")
public class KuisionerJawabanController {

    private final KuisionerJawabanService kuisionerJawabanService;

    public KuisionerJawabanController(KuisionerJawabanService kuisionerJawabanService) {
        this.kuisionerJawabanService = kuisionerJawabanService;
    }

    // GET all
    @GetMapping
    public List<KuisionerJawaban> getAll() {
        return kuisionerJawabanService.getAll();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<KuisionerJawaban> getById(@PathVariable Long id) {
        return kuisionerJawabanService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE satu jawaban
    @PostMapping
    public KuisionerJawaban create(@RequestBody KuisionerJawaban jawaban) {
        return kuisionerJawabanService.create(jawaban);
    }

    // CREATE banyak jawaban sekaligus
    @PostMapping("/submit")
    public ResponseEntity<String> submit(@RequestBody List<KuisionerJawaban> jawabanList) {
        kuisionerJawabanService.saveAll(jawabanList);
        return ResponseEntity.ok("Jawaban kuisioner berhasil disimpan!");
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<KuisionerJawaban> update(@PathVariable Long id, @RequestBody KuisionerJawaban jawabanDetails) {
        try {
            return ResponseEntity.ok(kuisionerJawabanService.update(id, jawabanDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        kuisionerJawabanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET by siswa
    @GetMapping("/siswa/{siswaId}")
    public List<KuisionerJawaban> getBySiswa(@PathVariable Long siswaId) {
        return kuisionerJawabanService.getBySiswaId(siswaId);
    }

    // ✅ Statistik rata-rata per guru
    @GetMapping("/statistik/guru")
    public List<Map<String, Object>> getStatistikPerGuru() {
        return kuisionerJawabanService.getRataRataPerGuru();
    }
}
