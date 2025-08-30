package com.example.backend.model; // Menentukan package untuk model entitas yang akan dipetakan ke tabel dalam database

import jakarta.persistence.*; // Mengimpor anotasi JPA untuk memetakan kelas Java ke dalam tabel database
import java.time.LocalDateTime; // Mengimpor kelas LocalDateTime untuk menangani tanggal dan waktu

@Entity // Menandakan bahwa kelas ini adalah entitas yang akan dipetakan ke dalam tabel database
@Table(name = "feedback") // Menentukan nama tabel di database untuk entitas ini, yaitu tabel "feedback"
public class Feedback { // Kelas ini merepresentasikan entitas Feedback di dalam sistem, yang digunakan untuk menyimpan data feedback pengguna

    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Mengatur agar ID di-generate secara otomatis oleh database menggunakan strategi auto-increment
    private Long id; // ID unik untuk setiap entri feedback

    private Long userId; // Menyimpan ID pengguna yang memberikan feedback, namun tidak ada relasi langsung dengan entitas User

    private String type; // Menyimpan jenis feedback, misalnya "SARAN" atau "UCAPAN"

    private String title; // Menyimpan judul atau topik feedback, bersifat opsional, bisa digunakan untuk feedback ke guru atau topik tertentu

    @Column(columnDefinition = "TEXT") // Menentukan bahwa kolom ini akan disimpan sebagai tipe data TEXT di database
    private String content; // Menyimpan isi feedback, apakah saran atau ucapan, dengan panjang karakter yang tidak terbatas

    private String themeColor; // Menyimpan informasi warna tema, misalnya untuk styling dalam antarmuka pengguna (UI) feedback

    private Boolean anonim = false; // Menyimpan status anonim atau tidaknya feedback; default adalah false (tidak anonim)

    private LocalDateTime createdAt = LocalDateTime.now(); // Menyimpan waktu pembuatan feedback, dengan nilai default waktu saat objek dibuat

    // --- Getter & Setter ---
    public Long getId() { return id; } // Mengambil ID dari feedback
    public void setId(Long id) { this.id = id; } // Mengatur ID feedback

    public Long getUserId() { return userId; } // Mengambil ID pengguna yang memberikan feedback
    public void setUserId(Long userId) { this.userId = userId; } // Mengatur ID pengguna yang memberikan feedback

    public String getType() { return type; } // Mengambil jenis feedback (SARAN atau UCAPAN)
    public void setType(String type) { this.type = type; } // Mengatur jenis feedback (SARAN atau UCAPAN)

    public String getTitle() { return title; } // Mengambil judul dari feedback
    public void setTitle(String title) { this.title = title; } // Mengatur judul dari feedback

    public String getContent() { return content; } // Mengambil isi dari feedback
    public void setContent(String content) { this.content = content; } // Mengatur isi dari feedback

    public String getThemeColor() { return themeColor; } // Mengambil warna tema untuk styling feedback
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; } // Mengatur warna tema untuk styling feedback

    public Boolean getAnonim() { return anonim; } // Mengambil status anonim dari feedback
    public void setAnonim(Boolean anonim) { this.anonim = anonim; } // Mengatur status anonim dari feedback

    public LocalDateTime getCreatedAt() { return createdAt; } // Mengambil waktu pembuatan feedback
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; } // Mengatur waktu pembuatan feedback
}
