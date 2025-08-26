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
        if (jawabanList.isEmpty()) {
            return ResponseEntity.badRequest().body("List jawaban kosong!");
        }

        Long siswaId = jawabanList.get(0).getSiswa().getId();
        Long guruId = jawabanList.get(0).getGuruMapel().getId();

        // ✅ Validasi: siswa hanya bisa isi sekali per guru
        if (kuisionerJawabanService.existsBySiswaIdAndGuruId(siswaId, guruId)) {
            return ResponseEntity.badRequest().body("❌ Kuisioner untuk guru ini sudah pernah diisi!");
        }

        kuisionerJawabanService.saveAll(jawabanList);
        return ResponseEntity.ok("✅ Jawaban kuisioner berhasil disimpan!");
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

    // ✅ Cek apakah siswa sudah isi kuisioner untuk guru tertentu
    @GetMapping("/cek")
    public Map<String, Boolean> cekSudahIsi(
            @RequestParam Long siswaId,
            @RequestParam Long guruId
    ) {
        boolean sudahIsi = kuisionerJawabanService.existsBySiswaIdAndGuruId(siswaId, guruId);
        return Map.of("sudahIsi", sudahIsi);
    }
}
