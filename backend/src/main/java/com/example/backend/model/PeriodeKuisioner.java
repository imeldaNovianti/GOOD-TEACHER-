package com.example.backend.model; // Menentukan package untuk entitas ini

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok
import java.time.LocalDate; // Mengimpor kelas LocalDate untuk menangani tanggal

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "periode_kuisioner") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "periode_kuisioner"
@Data // Lombok annotation untuk auto-generate getter, setter, toString, equals, dan hashCode
@NoArgsConstructor // Lombok annotation untuk constructor tanpa parameter
@AllArgsConstructor // Lombok annotation untuk constructor dengan semua parameter
@Builder // Lombok annotation untuk pattern builder
public class PeriodeKuisioner {
    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri periode kuisioner

    private String nama; // Nama periode kuisioner

    private LocalDate mulai; // Tanggal mulai periode kuisioner

    private LocalDate selesai; // Tanggal selesai periode kuisioner

    private String status; // Status periode kuisioner ("AKTIF" atau "TIDAK_AKTIF")
}
