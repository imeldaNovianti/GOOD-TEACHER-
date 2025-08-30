package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani waktu

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "laporan_download") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "laporan_download"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class LaporanDownload {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri LaporanDownload

    private String filePath; // Menyimpan path file laporan yang diunduh

    private LocalDateTime createdAt; // Menyimpan waktu pembuatan laporan download

    @ManyToOne // Relasi banyak ke satu dengan entitas User (admin)
    @JoinColumn(name = "admin_id") // Kolom yang menghubungkan ke tabel User (admin), dengan kolom "admin_id"
    private User admin; // Relasi ke entitas User (admin yang mengunduh laporan)

    @ManyToOne // Relasi banyak ke satu dengan entitas GuruMapel
    @JoinColumn(name = "guru_mapel_id") // Kolom yang menghubungkan ke tabel GuruMapel, dengan kolom "guru_mapel_id"
    private GuruMapel guruMapel; // Relasi ke entitas GuruMapel

    @ManyToOne // Relasi banyak ke satu dengan entitas PeriodeKuisioner
    @JoinColumn(name = "periode_id") // Kolom yang menghubungkan ke tabel PeriodeKuisioner, dengan kolom "periode_id"
    private PeriodeKuisioner periode; // Relasi ke entitas PeriodeKuisioner
}
