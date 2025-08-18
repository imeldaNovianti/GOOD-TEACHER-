package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "pertanyaan")
public class Pertanyaan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false, length = 500)
    private String teks;

    public Pertanyaan() {}
    public Pertanyaan(String teks) { this.teks = teks; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTeks() { return teks; }
    public void setTeks(String teks) { this.teks = teks; }
}
