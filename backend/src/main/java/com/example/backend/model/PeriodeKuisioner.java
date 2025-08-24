package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "periode_kuisioner")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodeKuisioner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nama;

    private LocalDate mulai;

    private LocalDate selesai;

    private String status; // "AKTIF", "TIDAK_AKTIF"
}
