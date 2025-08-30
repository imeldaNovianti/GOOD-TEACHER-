package com.example.backend.model; // Mendefinisikan package untuk model, tempat kelas-kelas yang berhubungan dengan data disimpan

import com.fasterxml.jackson.annotation.JsonBackReference; // Mengimpor anotasi JsonBackReference untuk menghindari siklus referensi saat serialisasi JSON
import jakarta.persistence.*; // Mengimpor anotasi JPA untuk memetakan objek ke tabel database

@Entity // Menandakan bahwa kelas ini adalah entitas JPA yang akan dipetakan ke tabel database
@Table(name = "achievements") // Menentukan nama tabel di database yang akan di-mapping ke kelas ini
public class Achievement { // Mendefinisikan kelas Achievement yang akan merepresentasikan data pencapaian pengguna

    @Id // Menandakan bahwa field ini adalah primary key untuk entitas ini
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Menandakan bahwa nilai ID akan di-generate secara otomatis oleh database menggunakan strategi auto increment
    private Long id; // ID unik untuk setiap pencapaian (Achievement)

    private String title; // Judul pencapaian, contoh: "Rookie", "Consistency"
    private String description; // Deskripsi pencapaian, contoh: "Isi kuisioner pertama kali"
    private boolean unlocked; // Status apakah pencapaian sudah dibuka (unlocked) atau belum

    @ManyToOne(fetch = FetchType.LAZY) // Menandakan bahwa relasi ini adalah Many-to-One, yaitu banyak pencapaian milik satu user
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_achievement_user")) // Menentukan nama kolom yang menyimpan ID user dan memastikan ini adalah foreign key
    @JsonBackReference // Menandakan bahwa bagian ini akan dihindari saat serialisasi JSON untuk mencegah siklus referensi (menghindari infinite recursion)
    private User user; // Relasi ke entitas User yang menunjukkan bahwa pencapaian ini milik seorang pengguna (User)

    public Achievement() {} // Konstruktor kosong (default constructor) yang dibutuhkan oleh JPA

    public Achievement(String title, String description, boolean unlocked, User user) { // Konstruktor dengan parameter untuk memudahkan pembuatan objek Achievement
        this.title = title; // Mengatur nilai title dari parameter
        this.description = description; // Mengatur nilai description dari parameter
        this.unlocked = unlocked; // Mengatur status unlocked dari parameter
        this.user = user; // Mengatur user yang berhubungan dengan pencapaian ini
    }

    // --- Getter & Setter --- 
    public Long getId() { return id; } // Mengambil ID pencapaian
    public void setId(Long id) { this.id = id; } // Mengatur ID pencapaian

    public String getTitle() { return title; } // Mengambil judul pencapaian
    public void setTitle(String title) { this.title = title; } // Mengatur judul pencapaian

    public String getDescription() { return description; } // Mengambil deskripsi pencapaian
    public void setDescription(String description) { this.description = description; } // Mengatur deskripsi pencapaian

    public boolean isUnlocked() { return unlocked; } // Mengambil status apakah pencapaian sudah dibuka
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; } // Mengatur status unlocked

    public User getUser() { return user; } // Mengambil user yang memiliki pencapaian ini
    public void setUser(User user) { this.user = user; } // Mengatur user yang memiliki pencapaian ini
}
