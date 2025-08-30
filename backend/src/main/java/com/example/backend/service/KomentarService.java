// package com.example.backend.service;

// import com.example.backend.model.GuruMapel;
// import com.example.backend.model.Komentar;
// import com.example.backend.model.PeriodeKuisioner;
// import com.example.backend.model.User;
// import com.example.backend.repository.GuruMapelRepository;
// import com.example.backend.repository.KomentarRepository;
// import com.example.backend.repository.PeriodeKuisionerRepository;
// import com.example.backend.repository.UserRepository;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class KomentarService {

//     private final KomentarRepository komentarRepository;
//     private final UserRepository userRepository;
//     private final GuruMapelRepository guruMapelRepository;
//     private final PeriodeKuisionerRepository periodeKuisionerRepository;

//     public KomentarService(KomentarRepository komentarRepository,
//                            UserRepository userRepository,
//                            GuruMapelRepository guruMapelRepository,
//                            PeriodeKuisionerRepository periodeKuisionerRepository) {
//         this.komentarRepository = komentarRepository;
//         this.userRepository = userRepository;
//         this.guruMapelRepository = guruMapelRepository;
//         this.periodeKuisionerRepository = periodeKuisionerRepository;
//     }

//     public List<Komentar> getAll() {
//         return komentarRepository.findAll();
//     }

//     public Optional<Komentar> getById(Long id) {
//         return komentarRepository.findById(id);
//     }

//     public Komentar create(Long siswaId, Long guruMapelId, Long periodeId, String isiKomentar) {
//         User siswa = userRepository.findById(siswaId)
//                 .orElseThrow(() -> new RuntimeException("Siswa not found"));
//         GuruMapel guruMapel = guruMapelRepository.findById(guruMapelId)
//                 .orElseThrow(() -> new RuntimeException("GuruMapel not found"));
//         PeriodeKuisioner periode = periodeKuisionerRepository.findById(periodeId)
//                 .orElseThrow(() -> new RuntimeException("Periode not found"));

//         Komentar komentar = Komentar.builder()
//                 .siswa(siswa)
//                 .guruMapel(guruMapel)
//                 .periode(periode)
//                 .isiKomentar(isiKomentar)
//                 .createdAt(LocalDateTime.now())
//                 .build();

//         return komentarRepository.save(komentar);
//     }

//     public Komentar update(Long id, String isiKomentar) {
//         return komentarRepository.findById(id)
//                 .map(k -> {
//                     k.setIsiKomentar(isiKomentar);
//                     return komentarRepository.save(k);
//                 })
//                 .orElseThrow(() -> new RuntimeException("Komentar not found with id " + id));
//     }

//     public void delete(Long id) {
//         komentarRepository.deleteById(id);
//     }

//     public List<Komentar> findByGuruMapel(Long guruMapelId) {
//         return komentarRepository.findByGuruMapelId(guruMapelId);
//     }

//     public List<Komentar> findBySiswa(Long siswaId) {
//         return komentarRepository.findBySiswaId(siswaId);
//     }

//     public List<Komentar> findByPeriode(Long periodeId) {
//         return komentarRepository.findByPeriodeId(periodeId);
//     }
// }
