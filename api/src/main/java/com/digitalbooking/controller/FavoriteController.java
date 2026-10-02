package com.digitalbooking.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import com.digitalbooking.dto.FavoriteResponse;
import com.digitalbooking.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Autowired
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FavoriteResponse>> getUserFavorites(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(favoriteService.getUserFavorites(email));
    }

    @PostMapping("/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FavoriteResponse> addFavorite(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        FavoriteResponse response = favoriteService.addFavorite(productId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        favoriteService.removeFavorite(productId, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Boolean>> isFavorite(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        boolean isFav = favoriteService.isFavorite(productId, email);
        return ResponseEntity.ok(Collections.singletonMap("isFavorite", isFav));
    }
}
