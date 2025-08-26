package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // auto dari NISN atau fallback

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, name = "nama_lengkap")
    private String namaLengkap;

    @Column(nullable = false, unique = true)
    private String nisn;

    @Column(nullable = false)
    private String kelas;

    @Column(nullable = false)
    private String role = "SISWA"; // default SISWA

    private String email;
    private String noHp;
    private String alamat;
    private String tglLahir;
    private String namaAyah;
    private String namaIbu;

    public User() {}

    public User(String username, String password, String namaLengkap, String nisn, String kelas) {
        this.username = username;
        this.password = password;
        this.namaLengkap = namaLengkap;
        this.nisn = nisn;
        this.kelas = kelas;
        this.role = "SISWA";
    }

    @PrePersist
    public void prePersist() {
        // kalau username kosong → auto isi dengan nisn
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
}
