package com.example.backend.controller; // Menentukan package untuk controller dalam aplikasi

import com.example.backend.model.PeriodeKuisioner; // Mengimpor model PeriodeKuisioner untuk menangani data periode kuisioner
import com.example.backend.service.PeriodeKuisionerService; // Mengimpor service yang menangani logika bisnis untuk periode kuisioner
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk menangani response HTTP
import org.springframework.web.bind.annotation.*; // Mengimpor anotasi untuk menangani HTTP requests

import java.util.List; // Mengimpor List untuk menangani koleksi data periode kuisioner

@RestController // Menandakan bahwa kelas ini adalah Spring REST Controller
@RequestMapping("/api/periode-kuisioner") // Menentukan path dasar untuk semua endpoint dalam controller ini
public class PeriodeKuisionerController { // Mendefinisikan controller untuk mengelola periode kuisioner

    private final PeriodeKuisionerService periodeService; // Mendeklarasikan service untuk menangani logika bisnis periode kuisioner

    public PeriodeKuisionerController(PeriodeKuisionerService periodeService) { // Constructor untuk menyuntikkan PeriodeKuisionerService ke dalam controller
        this.periodeService = periodeService; // Menyimpan periodeService ke dalam field
    }

    // GET all - Mendapatkan semua periode kuisioner
    @GetMapping // Mendefinisikan endpoint GET untuk mengambil semua periode kuisioner
    public List<PeriodeKuisioner> getAll() { // Mendefinisikan method untuk menangani permintaan GET untuk mendapatkan semua periode kuisioner
        return periodeService.getAll(); // Memanggil service untuk mendapatkan semua periode kuisioner dan mengembalikannya
    }

    // GET by ID - Mendapatkan periode kuisioner berdasarkan ID
    @GetMapping("/{id}") // Mendefinisikan endpoint GET untuk mengambil periode kuisioner berdasarkan ID
    public ResponseEntity<PeriodeKuisioner> getById(@PathVariable Long id) { // Mengambil ID dari URL path
        return periodeService.getById(id) // Memanggil service untuk mendapatkan periode kuisioner berdasarkan ID
                .map(ResponseEntity::ok) // Jika periode kuisioner ditemukan, mengembalikan respon 200 OK dengan data periode kuisioner
                .orElse(ResponseEntity.notFound().build()); // Jika periode kuisioner tidak ditemukan, mengembalikan respon 404 Not Found
    }

    // CREATE - Membuat periode kuisioner baru
    @PostMapping // Mendefinisikan endpoint POST untuk membuat periode kuisioner baru
    public PeriodeKuisioner create(@RequestBody PeriodeKuisioner periode) { // Mengambil data periode kuisioner dari body request
        return periodeService.create(periode); // Memanggil service untuk menyimpan periode kuisioner dan mengembalikannya
    }

    // UPDATE - Memperbarui periode kuisioner berdasarkan ID
    @PutMapping("/{id}") // Mendefinisikan endpoint PUT untuk memperbarui periode kuisioner berdasarkan ID
    public ResponseEntity<PeriodeKuisioner> update(@PathVariable Long id, @RequestBody PeriodeKuisioner periodeDetails) { // Mengambil ID dan data periode kuisioner yang akan diperbarui
        try {
            return ResponseEntity.ok(periodeService.update(id, periodeDetails)); // Memanggil service untuk memperbarui periode kuisioner dan mengembalikannya
        } catch (RuntimeException e) { // Menangani error jika data periode kuisioner tidak ditemukan
            return ResponseEntity.notFound().build(); // Mengembalikan respon 404 Not Found jika periode kuisioner tidak ditemukan
        }
    }

    // DELETE - Menghapus periode kuisioner berdasarkan ID
    @DeleteMapping("/{id}") // Mendefinisikan endpoint DELETE untuk menghapus periode kuisioner berdasarkan ID
    public ResponseEntity<Void> delete(@PathVariable Long id) { // Mengambil ID dari URL untuk periode kuisioner yang akan dihapus
        periodeService.delete(id); // Memanggil service untuk menghapus periode kuisioner berdasarkan ID
        return ResponseEntity.noContent().build(); // Mengembalikan respon 204 No Content sebagai indikasi bahwa data berhasil dihapus
    }

    // GET by status - Mendapatkan periode kuisioner berdasarkan status
    @GetMapping("/status/{status}") // Mendefinisikan endpoint GET untuk mengambil periode kuisioner berdasarkan status
    public List<PeriodeKuisioner> getByStatus(@PathVariable String status) { // Mengambil status dari URL path
        return periodeService.getByStatus(status); // Memanggil service untuk mendapatkan periode kuisioner berdasarkan status
    }
}
