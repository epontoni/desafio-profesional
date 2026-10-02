package com.digitalbooking.service;

import com.digitalbooking.dto.UserResponse;
import com.digitalbooking.dto.UserRoleUpdateRequest;
import com.digitalbooking.exception.ResourceNotFoundException;
import com.digitalbooking.model.User;
import com.digitalbooking.repository.UserRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import com.digitalbooking.dto.UserUpdateRequest;
import com.digitalbooking.dto.UserPasswordUpdateRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, DtoMapper dtoMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(dtoMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return dtoMapper.toUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return dtoMapper.toUserResponse(user);
    }

    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
    }

    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public UserResponse updateUserRole(Long id, UserRoleUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setRole(request.getRole());
        User updated = userRepository.save(user);
        return dtoMapper.toUserResponse(updated);
    }
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        User updated = userRepository.save(user);
        return dtoMapper.toUserResponse(updated);
    }

    @Transactional
    public UserResponse changePassword(Long id, UserPasswordUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Contraseña actual incorrecta");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        User updated = userRepository.save(user);
        return dtoMapper.toUserResponse(updated);
    }

}
