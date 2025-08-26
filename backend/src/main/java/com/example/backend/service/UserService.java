package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // Pagination + search
    public Page<User> getAll(String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search == null || search.isBlank()) {
            return repo.findAll(pageable);
        }

        return repo.findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, search, search, pageable
        );
    }

    public User getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }

    public User save(User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getNisn()); // fallback pakai NISN
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password wajib diisi");
        }
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("SISWA");
        }
        return repo.save(user);
    }

    public User update(Long id, User newUser) {
        User u = repo.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

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

        if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
            u.setPassword(newUser.getPassword());
        }

        if (newUser.getUsername() != null && !newUser.getUsername().isBlank()) {
            u.setUsername(newUser.getUsername());
        } else if (u.getUsername() == null || u.getUsername().isBlank()) {
            u.setUsername(newUser.getNisn());
        }

        return repo.save(u);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public User findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public User findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
}
