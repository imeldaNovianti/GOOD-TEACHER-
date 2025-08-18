package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "siswa")
public class Siswa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false, length = 120)
    private String nama;

    @NotBlank @Column(nullable = false, unique = true, length = 30)
    private String nim;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jurusan_id", nullable = false)
    private Jurusan jurusan;

    public Siswa() {}
    public Siswa(String nama, String nim, Jurusan jurusan) {
        this.nama = nama; this.nim = nim; this.jurusan = jurusan;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public String getNim() { return nim; }
    public void setNim(String nim) { this.nim = nim; }
    public Jurusan getJurusan() { return jurusan; }
    public void setJurusan(Jurusan jurusan) { this.jurusan = jurusan; }
}
