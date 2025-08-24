package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

// import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // ✅ Ambil semua dengan pagination, sorting, search
    public Page<User> getAll(String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search == null || search.isBlank()) {
            return repo.findAll(pageable);
        }

        // search by namaLengkap OR nisn OR kelas OR email
        return repo.findByNamaLengkapContainingIgnoreCaseOrNisnContainingIgnoreCaseOrKelasContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, search, search, pageable
        );
    }

    // ✅ Ambil by ID
    public User getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }

    // ✅ Create user baru
    public User save(User user) {
        // fallback username → nisn
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getNisn());
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password wajib diisi");
        }
        return repo.save(user);
    }

    // ✅ Update user
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

        // hanya update password kalau diisi
        if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
            u.setPassword(newUser.getPassword());
        }

        // username default tetap nisn
        if (newUser.getUsername() != null && !newUser.getUsername().isBlank()) {
            u.setUsername(newUser.getUsername());
        } else if (u.getUsername() == null || u.getUsername().isBlank()) {
            u.setUsername(newUser.getNisn());
        }

        return repo.save(u);
    }

    // ✅ Delete user
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
