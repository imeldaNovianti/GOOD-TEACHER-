package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "guru")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Guru {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nama;

    @Column(nullable = false, unique = true)
    private String email; // ✅ tambahkan field email

    @ManyToOne
    @JoinColumn(name = "fakultas_id")
    private Fakultas fakultas;

    @ManyToOne
    @JoinColumn(name = "jurusan_id")
    private Jurusan jurusan;
}
