package com.example.backend.model; // Menentukan package untuk entitas ini

import com.fasterxml.jackson.annotation.JsonManagedReference; // Mengimpor anotasi untuk pengelolaan relasi JSON
import jakarta.persistence.*; // Mengimpor anotasi JPA untuk pemetaan entitas ke dalam database
import lombok.*; // Mengimpor anotasi Lombok
import java.util.ArrayList; // Mengimpor ArrayList untuk daftar achievements
import java.util.List; // Mengimpor List untuk daftar achievements

@Entity // Menandakan bahwa kelas ini adalah entitas JPA
@Table(name = "users") // Menentukan nama tabel dalam database untuk entitas ini, yaitu "users"
public class User {

    @Id // Menandakan bahwa field ini adalah primary key untuk entitas
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Strategi auto-increment untuk ID
    private Long id; // ID unik untuk entri User

    @Column(nullable = false, unique = true) // Kolom username harus unik dan tidak null
    private String username; // Nama pengguna (dapat berasal dari NISN atau fallback)

    @Column(nullable = false) // Kolom password tidak boleh null
    private String password; // Password pengguna

    @Column(nullable = false, name = "nama_lengkap") // Kolom nama lengkap tidak boleh null
    private String namaLengkap; // Nama lengkap pengguna

    @Column(nullable = false, unique = true) // Kolom NISN harus unik dan tidak null
    private String nisn; // NISN siswa

    @Column(nullable = false) // Kolom kelas tidak boleh null
    private String kelas; // Kelas pengguna

    @Column(nullable = false) // Kolom role tidak boleh null
    private String role = "SISWA"; // Default role adalah "SISWA"

    private String email; // Email pengguna (opsional)

    private String noHp; // Nomor telepon pengguna (opsional)

    private String alamat; // Alamat pengguna (opsional)

    private String tglLahir; // Tanggal lahir pengguna (opsional)

    private String namaAyah; // Nama ayah (opsional)

    private String namaIbu; // Nama ibu (opsional)

    // Relasi ke Achievement
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // Relasi satu ke banyak dengan entitas Achievement
    @JsonManagedReference // Untuk mengelola relasi JSON agar tidak terjadi rekursi
    private List<Achievement> achievements = new ArrayList<>(); // Daftar achievements pengguna

    // Constructor tanpa parameter
    public User() {}

    // Constructor dengan beberapa parameter utama
    public User(String username, String password, String namaLengkap, String nisn, String kelas) {
        this.username = username;
        this.password = password;
        this.namaLengkap = namaLengkap;
        this.nisn = nisn;
        this.kelas = kelas;
        this.role = "SISWA";
    }

    // Metode yang dipanggil sebelum entitas disimpan ke database
    @PrePersist
    public void prePersist() {
        if (username == null || username.isBlank()) {
            username = (nisn != null && !nisn.isBlank())
                    ? nisn
                    : "user" + System.currentTimeMillis();
        }
        if (role == null || role.isBlank()) {
            role = "SISWA";
        }
    }

    // --- Getter & Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNamaLengkap() { return namaLengkap; }
    public void setNamaLengkap(String namaLengkap) { this.namaLengkap = namaLengkap; }

    public String getNisn() { return nisn; }
    public void setNisn(String nisn) { this.nisn = nisn; }

    public String getKelas() { return kelas; }
    public void setKelas(String kelas) { this.kelas = kelas; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNoHp() { return noHp; }
    public void setNoHp(String noHp) { this.noHp = noHp; }

    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }

    public String getTglLahir() { return tglLahir; }
    public void setTglLahir(String tglLahir) { this.tglLahir = tglLahir; }

    public String getNamaAyah() { return namaAyah; }
    public void setNamaAyah(String namaAyah) { this.namaAyah = namaAyah; }

    public String getNamaIbu() { return namaIbu; }
    public void setNamaIbu(String namaIbu) { this.namaIbu = namaIbu; }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }
}
