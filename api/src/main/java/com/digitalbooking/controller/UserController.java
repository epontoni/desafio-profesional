package com.digitalbooking.controller;

import com.digitalbooking.dto.UserResponse;
import com.digitalbooking.dto.UserUpdateRequest;
import com.digitalbooking.dto.UserPasswordUpdateRequest;
import com.digitalbooking.dto.UserRoleUpdateRequest;
import com.digitalbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id, @Valid @RequestBody UserRoleUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserRole(id, request));
}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> changePassword(@PathVariable Long id, @Valid @RequestBody UserPasswordUpdateRequest request) {
        return ResponseEntity.ok(userService.changePassword(id, request));
    }
}
