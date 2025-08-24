package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kuisioner_jawaban")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KuisionerJawaban {
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
    @JoinColumn(name = "pertanyaan_id")
    private Pertanyaan pertanyaan;

    private Integer jawaban; // Skala 1-5

    private LocalDateTime createdAt;
}
