// package com.example.backend.controller;

// import com.example.backend.model.Komentar;
// import com.example.backend.service.KomentarService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/komentar")
// public class KomentarController {

//     private final KomentarService komentarService;

//     public KomentarController(KomentarService komentarService) {
//         this.komentarService = komentarService;
//     }

//     // GET all
//     @GetMapping
//     public List<Komentar> getAll() {
//         return komentarService.getAll();
//     }

//     // GET by ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Komentar> getById(@PathVariable Long id) {
//         return komentarService.getById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     // CREATE
//     @PostMapping
//     public Komentar create(@RequestBody Map<String, Object> request) {
//         Long siswaId = Long.valueOf(request.get("siswaId").toString());
//         Long guruMapelId = Long.valueOf(request.get("guruMapelId").toString());
//         Long periodeId = Long.valueOf(request.get("periodeId").toString());
//         String isiKomentar = request.get("isiKomentar").toString();

//         return komentarService.create(siswaId, guruMapelId, periodeId, isiKomentar);
//     }

//     // UPDATE
//     @PutMapping("/{id}")
//     public ResponseEntity<Komentar> update(@PathVariable Long id, @RequestBody Map<String, Object> request) {
//         String isiKomentar = request.get("isiKomentar").toString();
//         try {
//             return ResponseEntity.ok(komentarService.update(id, isiKomentar));
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     // DELETE
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable Long id) {
//         komentarService.delete(id);
//         return ResponseEntity.noContent().build();
//     }

//     // FILTER: by guruu
//     @GetMapping("/guru/{guruId}")
//     public List<Komentar> getByGuru(@PathVariable Long guruId) {
//         return komentarService.findByGuruMapel(guruId);
//     }

//     // FILTER: by siswa
//     @GetMapping("/siswa/{siswaId}")
//     public List<Komentar> getBySiswa(@PathVariable Long siswaId) {
//         return komentarService.findBySiswa(siswaId);
//     }

//     // FILTER: by periode
//     @GetMapping("/periode/{periodeId}")
//     public List<Komentar> getByPeriode(@PathVariable Long periodeId) {
//         return komentarService.findByPeriode(periodeId);
//     }
// }
