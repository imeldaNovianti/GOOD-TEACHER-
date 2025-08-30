package com.example.backend.config; // Mengimpor package untuk konfigurasi Spring Security

import org.springframework.context.annotation.Bean; // Mengimpor anotasi Bean untuk mendefinisikan beans
import org.springframework.context.annotation.Configuration; // Mengimpor anotasi Configuration untuk kelas konfigurasi
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Mengimpor kelas HttpSecurity untuk mengkonfigurasi keamanan HTTP
import org.springframework.security.web.SecurityFilterChain; // Mengimpor SecurityFilterChain untuk menentukan bagaimana filter keamanan bekerja
import org.springframework.web.cors.CorsConfiguration; // Mengimpor CorsConfiguration untuk mengatur pengaturan CORS
import org.springframework.web.cors.CorsConfigurationSource; // Mengimpor CorsConfigurationSource untuk mendefinisikan sumber konfigurasi CORS
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Mengimpor UrlBasedCorsConfigurationSource untuk mengatur aturan CORS berdasarkan URL

import java.util.List; // Mengimpor kelas List untuk menggunakan daftar dalam konfigurasi CORS

@Configuration // Menandai kelas ini sebagai kelas konfigurasi Spring
public class SecurityConfig { // Mendefinisikan kelas konfigurasi keamanan Spring

    @Bean // Menandai metode ini untuk membuat bean Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { // Menyediakan konfigurasi filter keamanan untuk HTTP
        http
            .csrf(csrf -> csrf.disable()) // Menonaktifkan proteksi CSRF untuk aplikasi API, karena CSRF tidak diperlukan untuk API stateless
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Mengaktifkan CORS dengan menggunakan konfigurasi yang didefinisikan dalam metode corsConfigurationSource()
            .authorizeHttpRequests(auth -> auth // Mengonfigurasi aturan otorisasi untuk permintaan HTTP
                .requestMatchers("/api/**").permitAll() // Mengizinkan akses bebas untuk semua endpoint yang dimulai dengan /api/
                .anyRequest().permitAll()               // Mengizinkan akses bebas untuk semua permintaan lain (dalam konteks development)
            );

        return http.build(); // Membangun dan mengembalikan objek SecurityFilterChain yang telah dikonfigurasi
    }

    @Bean // Menandai metode ini untuk membuat bean Spring
    public CorsConfigurationSource corsConfigurationSource() { // Menyediakan sumber konfigurasi CORS
        CorsConfiguration config = new CorsConfiguration(); // Membuat objek konfigurasi CORS baru
        config.setAllowCredentials(true); // Memungkinkan pengiriman kredensial (seperti cookies dan header authorization) bersama dengan permintaan CORS
        config.setAllowedOriginPatterns(List.of( // Mengonfigurasi asal yang diizinkan untuk melakukan permintaan CORS
                "http://localhost:3000", // Mengizinkan asal dari server pengembangan React (port 3000)
                "http://localhost:5173"  // Mengizinkan asal dari server pengembangan Vite (port 5173)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Mengizinkan metode HTTP tertentu untuk permintaan CORS
        config.setAllowedHeaders(List.of("*")); // Mengizinkan semua header dalam permintaan CORS

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // Membuat objek sumber konfigurasi CORS berbasis URL
        source.registerCorsConfiguration("/**", config); // Mendaftarkan konfigurasi CORS untuk semua endpoint aplikasi
        return source; // Mengembalikan sumber konfigurasi CORS
    }
}
