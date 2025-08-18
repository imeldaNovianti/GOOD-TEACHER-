package com.example.backend.controller;

import com.example.backend.model.Jurusan;
import com.example.backend.repository.JurusanRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jurusan")
public class JurusanController {

    private final JurusanRepository jurusanRepository;

    public JurusanController(JurusanRepository jurusanRepository) {
        this.jurusanRepository = jurusanRepository;
    }

    // ✅ Get All Jurusan (default ascending by nama)
    @GetMapping
    public List<Jurusan> getAllJurusan(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        return jurusanRepository.findAll(sort);
    }

    // ✅ Search Jurusan by Nama
    @GetMapping("/search")
    public List<Jurusan> searchJurusan(@RequestParam String nama) {
        return jurusanRepository.findByNamaContainingIgnoreCase(nama);
    }

    // ✅ Create Jurusan
    @PostMapping
    public Jurusan createJurusan(@RequestBody Jurusan jurusan) {
        return jurusanRepository.save(jurusan);
    }
}
