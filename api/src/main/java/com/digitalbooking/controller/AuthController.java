package com.digitalbooking.controller;

import com.digitalbooking.dto.AuthRequest;
import com.digitalbooking.dto.AuthResponse;
import com.digitalbooking.model.User;
import com.digitalbooking.repository.UserRepository;
import com.digitalbooking.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public AuthController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Secure SHA-256 hashing for passwords
    public static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return password;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "El correo electrónico es obligatorio.");
            return ResponseEntity.badRequest().body(response);
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "El correo electrónico ya está registrado.");
            return ResponseEntity.badRequest().body(response);
        }

        // Default role is USER
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("ROLE_USER");
        }

        // Hash password before saving
        user.setPassword(hashPassword(user.getPassword()));

        User savedUser = userRepository.save(user);

        // Send confirmation email asynchronously (or console simulation)
        emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getFirstName());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    String hashedInput = hashPassword(request.getPassword());
                    if (user.getPassword().equals(hashedInput)) {
                        AuthResponse response = new AuthResponse(
                                user.getId(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getEmail(),
                                user.getRole()
                        );
                        return ResponseEntity.ok(response);
                    } else {
                        Map<String, String> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Correo electrónico o contraseña incorrectos.");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                    }
                })
                .orElseGet(() -> {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Correo electrónico o contraseña incorrectos.");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                });
    }
}
