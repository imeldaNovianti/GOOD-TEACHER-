package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kelas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Kelas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String namaKelas;

    private String waliKelas;
}
