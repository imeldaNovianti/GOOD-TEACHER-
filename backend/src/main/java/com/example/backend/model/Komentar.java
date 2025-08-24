package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "komentar")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Komentar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "siswa_id")
    private User siswa;

    @ManyToOne
    @JoinColumn(name = "guru_mapel_id")
    private GuruMapel guruMapel;

    @ManyToOne
    @JoinColumn(name = "periode_id")
    private PeriodeKuisioner periode;

    private String isiKomentar;

    private LocalDateTime createdAt;
}
