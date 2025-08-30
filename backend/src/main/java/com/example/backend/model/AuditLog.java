package com.example.backend.model; // Menentukan package untuk model entitas, tempat kelas-kelas data disimpan

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk memetakan objek ke tabel database
import lombok.*; // Mengimpor library Lombok untuk mempermudah penulisan getter, setter, dan konstruktor
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani tanggal dan waktu

@Entity // Menandakan bahwa kelas ini adalah entitas JPA yang akan dipetakan ke tabel database
@Table(name = "audit_log") // Menentukan nama tabel dalam database yang akan di-mapping ke kelas ini (tabel "audit_log")
@Data // Menggunakan Lombok untuk menghasilkan getter, setter, toString, equals, dan hashCode secara otomatis
@NoArgsConstructor // Lombok: Membuat konstruktor tanpa parameter (dibutuhkan oleh JPA)
@AllArgsConstructor // Lombok: Membuat konstruktor dengan semua parameter untuk memudahkan pembuatan objek dengan semua field
@Builder // Lombok: Menyediakan metode builder untuk membuat objek ini dengan cara yang lebih fleksibel
public class AuditLog { // Mendefinisikan kelas AuditLog yang akan merepresentasikan log aksi pengguna

    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Mengatur bahwa ID akan di-generate otomatis oleh database (auto-increment)
    private Long id; // ID unik untuk setiap entri log (AuditLog)

    private String aksi; // Nama atau deskripsi aksi yang dilakukan (contoh: "Login", "Data update")

    private LocalDateTime timestamp; // Waktu saat aksi tersebut terjadi, disimpan dengan tipe LocalDateTime

    @ManyToOne // Menandakan relasi "Many-to-One", di mana banyak entri AuditLog dapat berhubungan dengan satu User
    @JoinColumn(name = "user_id") // Menentukan kolom yang akan digunakan untuk menyimpan ID User yang terkait
    private User user; // Relasi ke entitas User, yang menunjukkan siapa yang melakukan aksi tersebut
}
