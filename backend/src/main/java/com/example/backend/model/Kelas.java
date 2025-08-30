package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "kelas") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "kelas"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class Kelas {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment
    private Long id; // ID unik untuk entri Kelas

    private String namaKelas; // Menyimpan nama kelas, misalnya: "12A", "10B", dll.

    private String waliKelas; // Menyimpan nama wali kelas yang mengajar kelas ini
}
