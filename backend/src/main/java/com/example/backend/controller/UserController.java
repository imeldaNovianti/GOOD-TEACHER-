package com.example.backend.controller; // Menentukan package untuk controller dalam aplikasi

import com.example.backend.model.User; // Mengimpor model User untuk menangani data user
import com.example.backend.service.UserService; // Mengimpor service yang menangani logika bisnis untuk user
import org.springframework.data.domain.Page; // Mengimpor Page untuk menangani pagination dalam hasil query
import org.springframework.http.HttpStatus; // Mengimpor HttpStatus untuk menangani status HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk menangani HTTP requests
import org.springframework.web.server.ResponseStatusException; // Mengimpor ResponseStatusException untuk menangani error HTTP

import jakarta.servlet.http.HttpSession; // Mengimpor HttpSession untuk menangani session HTTP

@RestController // Menandakan bahwa kelas ini adalah Spring REST Controller
@RequestMapping("/api/users") // Menentukan path dasar untuk semua endpoint dalam controller ini
@CrossOrigin(origins = "http://localhost:5173") // Menentukan sumber yang diizinkan (di sini berasal dari React front-end di localhost:5173)
public class UserController { // Mendefinisikan controller untuk mengelola operasi terkait user

    private final UserService service; // Mendeklarasikan service untuk menangani logika bisnis user

    public UserController(UserService service) { // Constructor untuk menyuntikkan UserService ke dalam controller
        this.service = service; // Menyimpan userService ke dalam field
    }

    // GET semua user dengan parameter pencarian dan pagination
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua user
    public Page<User> getAll( // Mendefinisikan method untuk menangani permintaan GET untuk mendapatkan semua user
            @RequestParam(defaultValue = "") String search, // Parameter pencarian untuk menyaring hasil berdasarkan nama atau kriteria lain
            @RequestParam(defaultValue = "0") int page, // Parameter untuk menentukan halaman yang diminta, default adalah halaman 0
            @RequestParam(defaultValue = "10") int size, // Parameter untuk menentukan jumlah user per halaman, default adalah 10
            @RequestParam(defaultValue = "id") String sortBy, // Parameter untuk menentukan field yang digunakan untuk pengurutan, default adalah "id"
            @RequestParam(defaultValue = "asc") String sortDir // Parameter untuk menentukan arah pengurutan, default adalah "asc" (ascending)
    ) {
        return service.getAll(search, page, size, sortBy, sortDir); // Memanggil service untuk mendapatkan daftar user dengan parameter yang diberikan
    }

    // GET berdasarkan ID user
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil user berdasarkan ID
    public User getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return service.getById(id); // Memanggil service untuk mendapatkan user berdasarkan ID
    }

    // ✅ Endpoint baru: ambil user yang sedang login
    @GetMapping("/me") // Mendefinisikan endpoint GET untuk mengambil user yang sedang login
    public User getMe(HttpSession session) { // Mengambil session HTTP untuk memeriksa user yang sedang login
        User user = (User) session.getAttribute("user"); // Mengambil objek user dari session
        if (user == null) { // Jika user tidak ditemukan di session
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Belum login"); // Mengembalikan respon 401 Unauthorized jika belum login
        }
        return service.getById(user.getId()); // Mengembalikan informasi user yang sedang login
    }

    // CREATE - Membuat user baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat user baru
    public User create(@RequestBody User user) { // Mengambil data user dari body request
        return service.save(user); // Memanggil service untuk menyimpan user dan mengembalikannya
    }

    // UPDATE - Memperbarui user berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui user berdasarkan ID
    public User update(@PathVariable Long id, @RequestBody User user) { // Mengambil ID dari URL dan data user yang akan diperbarui
        return service.update(id, user); // Memanggil service untuk memperbarui user dan mengembalikannya
    }

    // DELETE - Menghapus user berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus user berdasarkan ID
    public String delete(@PathVariable Long id) { // Mengambil ID dari URL path untuk user yang akan dihapus
        service.delete(id); // Memanggil service untuk menghapus user berdasarkan ID
        return "User dengan ID " + id + " berhasil dihapus"; // Mengembalikan pesan konfirmasi setelah user berhasil dihapus
    }

    // Register - Mendaftar user baru
    @PostMapping("/register") // Mendefinisikan endpoint POST untuk registrasi user baru
    public User register(@RequestBody User user) { // Mengambil data user dari body request
        return service.save(user); // Memanggil service untuk menyimpan user baru dan mengembalikannya
    }

    // Login - Melakukan autentikasi user
    @PostMapping("/login") // Mendefinisikan endpoint POST untuk login
    public User login(@RequestBody User loginRequest, HttpSession session) { // Mengambil data login dari request body dan session
        User user = service.findByEmail(loginRequest.getEmail()); // Mencari user berdasarkan email yang diberikan
        if (user == null) { // Jika user tidak ditemukan berdasarkan email
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email tidak ditemukan!"); // Mengembalikan respon 401 Unauthorized jika email tidak ditemukan
        }
        if (!user.getPassword().equals(loginRequest.getPassword())) { // Memeriksa kecocokan password
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password salah!"); // Mengembalikan respon 401 Unauthorized jika password salah
        }

        // Simpan user ke session jika login berhasil
        session.setAttribute("user", user); // Menyimpan user yang berhasil login ke dalam session
        return user; // Mengembalikan data user yang berhasil login
    }

    // Logout - Menghapus session user
    @PostMapping("/logout") // Mendefinisikan endpoint POST untuk logout
    public String logout(HttpSession session) { // Mengambil session untuk melakukan logout
        session.invalidate(); // Menghancurkan session yang ada, menandakan user telah logout
        return "Berhasil logout"; // Mengembalikan pesan bahwa logout berhasil
    }
}
