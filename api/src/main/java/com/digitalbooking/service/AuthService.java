package com.digitalbooking.service;

import com.digitalbooking.dto.AuthRequest;
import com.digitalbooking.dto.AuthResponse;
import com.digitalbooking.dto.UserRegisterRequest;
import com.digitalbooking.exception.BadRequestException;
import com.digitalbooking.exception.DuplicateResourceException;
import com.digitalbooking.model.User;
import com.digitalbooking.repository.UserRepository;
import com.digitalbooking.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("El correo electrónico ya está registrado.");
        }

        String role = request.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        }
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User savedUser = userRepository.save(user);

        // Send confirmation email
        try {
            emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getFirstName());
        } catch (Exception e) {
            System.err.println("AuthService: Error al enviar correo de bienvenida: " + e.getMessage());
        }

        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Correo electrónico o contraseña incorrectos."));

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
