package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // referensi user, tanpa relasi

    private String type; // SARAN atau UCAPAN

    private String title; // optional, misal topik atau untuk ucapan ke guru

    @Column(columnDefinition = "TEXT")
    private String content;

    private String themeColor; // misal untuk styling ucapan

    private Boolean anonim = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Getter & Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public Boolean getAnonim() { return anonim; }
    public void setAnonim(Boolean anonim) { this.anonim = anonim; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
