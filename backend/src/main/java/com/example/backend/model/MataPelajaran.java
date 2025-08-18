package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "mata_pelajaran")
public class MataPelajaran {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String nama;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jurusan_id")
    private Jurusan jurusan;

    public MataPelajaran() {}
    public MataPelajaran(String nama, Jurusan jurusan) {
        this.nama = nama; this.jurusan = jurusan;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }
    public Jurusan getJurusan() { return jurusan; }
    public void setJurusan(Jurusan jurusan) { this.jurusan = jurusan; }
}
