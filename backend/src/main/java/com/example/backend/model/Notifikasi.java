package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani waktu

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "notifikasi") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "notifikasi"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class Notifikasi {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri notifikasi

    private String pesan; // Menyimpan pesan notifikasi yang dikirim

    private String status; // Menyimpan status notifikasi ("TERBACA" atau "BELUM_TERBACA")

    private LocalDateTime createdAt; // Menyimpan waktu pembuatan notifikasi

    @ManyToOne // Relasi banyak ke satu dengan entitas User
    @JoinColumn(name = "user_id") // Kolom yang menghubungkan ke tabel User, dengan kolom "user_id"
    private User user; // Relasi ke entitas User (user yang menerima notifikasi)
}
