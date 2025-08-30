package com.example.backend.model; // Menentukan package untuk entitas yang akan dipetakan ke tabel dalam database

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke database
import lombok.*; // Mengimpor anotasi Lombok untuk generasi otomatis getter, setter, constructor, dll.

@Entity // Menandakan bahwa kelas ini adalah entitas yang akan dipetakan ke dalam tabel database
@Table(name = "guru_mapel") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "guru_mapel"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk auto-generate constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk auto-generate constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder yang mempermudah pembuatan objek
public class GuruMapel { 
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri GuruMapel

    private String namaGuru; // Menyimpan nama guru yang mengajar mata pelajaran

    private String mataPelajaran; // Menyimpan nama mata pelajaran yang diajarkan
}
