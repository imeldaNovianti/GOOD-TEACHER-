package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani waktu

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "komentar") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "komentar"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class Komentar {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri Komentar

    @ManyToOne // Relasi banyak ke satu dengan entitas User (siswa)
    @JoinColumn(name = "siswa_id") // Kolom yang menghubungkan ke tabel User, dengan kolom "siswa_id"
    private User siswa; // Relasi ke entitas User (siswa yang memberikan komentar)

    @ManyToOne // Relasi banyak ke satu dengan entitas GuruMapel
    @JoinColumn(name = "guru_mapel_id") // Kolom yang menghubungkan ke tabel GuruMapel, dengan kolom "guru_mapel_id"
    private GuruMapel guruMapel; // Relasi ke entitas GuruMapel

    @ManyToOne // Relasi banyak ke satu dengan entitas PeriodeKuisioner
    @JoinColumn(name = "periode_id") // Kolom yang menghubungkan ke tabel PeriodeKuisioner, dengan kolom "periode_id"
    private PeriodeKuisioner periode; // Relasi ke entitas PeriodeKuisioner

    private String isiKomentar; // Menyimpan isi komentar yang diberikan

    private LocalDateTime createdAt; // Menyimpan waktu pembuatan komentar
}
