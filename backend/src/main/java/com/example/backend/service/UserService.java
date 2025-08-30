package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;

    // Constructor untuk dependency injection
    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // Method untuk mengambil semua user dengan fitur pencarian dan pagination
    public Page<User> getAll(String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : // Mengatur sorting sesuai dengan parameter
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort); // Membuat objek Pageable untuk pagination

        // Jika tidak ada pencarian, mengambil semua user
        if (search == null || search.isBlank()) {
            return repo.findAll(pageable);
        }

        // Jika ada pencarian, mencari berdasarkan nama, NISN, kelas, atau email
        return repo.findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, search, search, pageable
        );
    }

    // Mengambil user berdasarkan ID
    public User getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan")); // Jika tidak ditemukan, lempar exception
    }

    // Menyimpan user baru atau memperbarui user yang sudah ada
    public User save(User user) {
        // Mengatur username jika tidak diberikan, fallback ke NISN
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getNisn()); // fallback pakai NISN
        }
        
        // Mengecek apakah password ada, jika tidak lempar exception
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password wajib diisi");
        }

        // Menetapkan role default sebagai "SISWA" jika belum diatur
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("SISWA");
        }

        return repo.save(user); // Menyimpan user ke database
    }

    // Memperbarui data user berdasarkan ID
    public User update(Long id, User newUser) {
        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan")); // Jika user tidak ditemukan

        // Memperbarui field user dengan data baru
        u.setNamaLengkap(newUser.getNamaLengkap());
        u.setNisn(newUser.getNisn());
        u.setKelas(newUser.getKelas());
        u.setEmail(newUser.getEmail());
        u.setNoHp(newUser.getNoHp());
        u.setAlamat(newUser.getAlamat());
        u.setTglLahir(newUser.getTglLahir());
        u.setNamaAyah(newUser.getNamaAyah());
        u.setNamaIbu(newUser.getNamaIbu());
        u.setRole(newUser.getRole());

        // Memperbarui password jika ada perubahan
        if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
            u.setPassword(newUser.getPassword());
        }

        // Memperbarui username jika ada perubahan, atau fallback ke NISN jika tidak ada username
        if (newUser.getUsername() != null && !newUser.getUsername().isBlank()) {
            u.setUsername(newUser.getUsername());
        } else if (u.getUsername() == null || u.getUsername().isBlank()) {
            u.setUsername(newUser.getNisn());
        }

        return repo.save(u); // Menyimpan perubahan data user
    }

    // Menghapus user berdasarkan ID
    public void delete(Long id) {
        repo.deleteById(id); // Menghapus user dari database
    }

    // Mencari user berdasarkan username
    public User findByUsername(String username) {
        return repo.findByUsername(username); // Mengambil user berdasarkan username
    }

    // Mencari user berdasarkan email
    public User findByEmail(String email) {
        return repo.findByEmail(email).orElse(null); // Mengambil user berdasarkan email, mengembalikan null jika tidak ditemukan
    }
}
