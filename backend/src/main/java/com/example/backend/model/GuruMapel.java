package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "guru_mapel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuruMapel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String namaGuru;

    private String mataPelajaran;
}
