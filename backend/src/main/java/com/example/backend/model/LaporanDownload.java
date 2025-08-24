package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "laporan_download")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaporanDownload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @ManyToOne
    @JoinColumn(name = "guru_mapel_id")
    private GuruMapel guruMapel;

    @ManyToOne
    @JoinColumn(name = "periode_id")
    private PeriodeKuisioner periode;
}
