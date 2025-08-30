package com.example.backend.model; // Menentukan package untuk entitas ini

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Untuk mengabaikan beberapa properti dalam serialisasi JSON
import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke database
import lombok.*; // Mengimpor anotasi Lombok
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani waktu

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "kuisioner_jawaban") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "kuisioner_jawaban"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class KuisionerJawaban {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri jawaban kuisioner

    @ManyToOne // Relasi banyak ke satu dengan entitas User (siswa)
    @JoinColumn(name = "siswa_id") // Kolom yang menghubungkan ke tabel User, dengan kolom "siswa_id"
    @JsonIgnoreProperties({"password", "jawabanList"}) // Mengabaikan beberapa properti dalam serialisasi JSON
    private User siswa; // Relasi ke entitas User (siswa yang menjawab kuisioner)

    @ManyToOne // Relasi banyak ke satu dengan entitas GuruMapel
    @JoinColumn(name = "guru_mapel_id") // Kolom yang menghubungkan ke tabel GuruMapel, dengan kolom "guru_mapel_id"
    @JsonIgnoreProperties({"jawabanList"}) // Mengabaikan properti jawabanList dalam serialisasi JSON
    private GuruMapel guruMapel; // Relasi ke entitas GuruMapel

    @ManyToOne // Relasi banyak ke satu dengan entitas Pertanyaan
    @JoinColumn(name = "pertanyaan_id") // Kolom yang menghubungkan ke tabel Pertanyaan, dengan kolom "pertanyaan_id"
    @JsonIgnoreProperties({"jawabanList"}) // Mengabaikan properti jawabanList dalam serialisasi JSON
    private Pertanyaan pertanyaan; // Relasi ke entitas Pertanyaan

    private Integer jawaban; // Menyimpan jawaban kuisioner berupa angka (misalnya skala 1-5)

    private LocalDateTime createdAt; // Menyimpan waktu pembuatan jawaban
}
