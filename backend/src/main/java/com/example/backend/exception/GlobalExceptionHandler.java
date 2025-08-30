package com.example.backend.exception; // Menentukan package untuk menangani exception (error handling) di aplikasi

import org.springframework.http.HttpStatus; // Mengimpor kelas HttpStatus untuk menentukan status HTTP yang akan dikembalikan pada response
import org.springframework.http.ResponseEntity; // Mengimpor ResponseEntity untuk membungkus respons HTTP dengan status dan body
import org.springframework.web.bind.MethodArgumentNotValidException; // Mengimpor exception yang terjadi jika validasi pada argument method gagal
import org.springframework.web.bind.annotation.ControllerAdvice; // Mengimpor ControllerAdvice untuk menangani exception global di seluruh aplikasi
import org.springframework.web.bind.annotation.ExceptionHandler; // Mengimpor ExceptionHandler untuk menangani berbagai jenis exception

import java.util.HashMap; // Mengimpor HashMap untuk menyimpan pasangan key-value error messages
import java.util.Map; // Mengimpor Map untuk menyimpan error dalam format key-value

@ControllerAdvice // Menandakan bahwa kelas ini akan menangani exception secara global di aplikasi
public class GlobalExceptionHandler { // Mendefinisikan kelas untuk menangani berbagai exception global

    // Method untuk menangani MethodArgumentNotValidException (terjadi jika validasi bean gagal)
    @ExceptionHandler(MethodArgumentNotValidException.class) // Menangani exception tipe MethodArgumentNotValidException
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) { // Method yang menangani exception tersebut
        Map<String, String> errors = new HashMap<>(); // Membuat map untuk menyimpan pasangan field dan pesan error
        ex.getBindingResult().getFieldErrors().forEach(error -> // Mengambil semua error field dari exception
                errors.put(error.getField(), error.getDefaultMessage())); // Menyimpan field dan pesan error ke dalam map
        return ResponseEntity.badRequest().body(errors); // Mengembalikan response dengan status 400 (Bad Request) dan body yang berisi errors
    }

    // Method untuk menangani semua exception lainnya
    @ExceptionHandler(Exception.class) // Menangani semua exception tipe umum (seperti Exception)
    public ResponseEntity<Map<String, String>> handleOtherExceptions(Exception ex) { // Method yang menangani exception tersebut
        Map<String, String> error = new HashMap<>(); // Membuat map untuk menyimpan pesan error
        error.put("error", ex.getMessage()); // Menyimpan pesan error ke dalam map dengan key "error"
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error); // Mengembalikan response dengan status 500 (Internal Server Error) dan body yang berisi pesan error
    }
}
