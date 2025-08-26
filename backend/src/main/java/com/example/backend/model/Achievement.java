package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // contoh: Rookie, Consistency
    private String description; // contoh: Isi kuisioner pertama kali
    private boolean unlocked;   // status achievement

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // relasi ke siswa

    public Achievement() {}

    public Achievement(String title, String description, boolean unlocked, User user) {
        this.title = title;
        this.description = description;
        this.unlocked = unlocked;
        this.user = user;
    }

    // getter & setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isUnlocked() { return unlocked; }
    public void setUnlocked(boolean unlocked) { this.unlocked = unlocked; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
