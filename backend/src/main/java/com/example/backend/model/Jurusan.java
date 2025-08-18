package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "jurusan")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Jurusan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nama;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fakultas_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // penting biar ga error saat return JSON
    private Fakultas fakultas;

    public Jurusan() {}

    public Jurusan(String nama, Fakultas fakultas) {
        this.nama = nama;
        this.fakultas = fakultas;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public Fakultas getFakultas() { return fakultas; }
    public void setFakultas(Fakultas fakultas) { this.fakultas = fakultas; }
}
