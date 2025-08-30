package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "pertanyaan") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "pertanyaan"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class Pertanyaan {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri pertanyaan

    private String teks; // Menyimpan teks pertanyaan yang diajukan

    private String tipeJawaban; // Menyimpan tipe jawaban yang diinginkan ("SKALA" atau "TEKS")
}
