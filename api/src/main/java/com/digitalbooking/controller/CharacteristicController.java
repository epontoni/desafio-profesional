package com.digitalbooking.controller;

import com.digitalbooking.dto.CharacteristicRequest;
import com.digitalbooking.dto.CharacteristicResponse;
import com.digitalbooking.service.CharacteristicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characteristics")
@CrossOrigin(origins = "*")
public class CharacteristicController {

    private final CharacteristicService characteristicService;

    @Autowired
    public CharacteristicController(CharacteristicService characteristicService) {
        this.characteristicService = characteristicService;
    }

    @GetMapping
    public ResponseEntity<List<CharacteristicResponse>> getAllCharacteristics() {
        return ResponseEntity.ok(characteristicService.getAllCharacteristics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CharacteristicResponse> getCharacteristicById(@PathVariable Long id) {
        return ResponseEntity.ok(characteristicService.getCharacteristicById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CharacteristicResponse> createCharacteristic(@Valid @RequestBody CharacteristicRequest request) {
        CharacteristicResponse response = characteristicService.createCharacteristic(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CharacteristicResponse> updateCharacteristic(@PathVariable Long id, @Valid @RequestBody CharacteristicRequest request) {
        CharacteristicResponse response = characteristicService.updateCharacteristic(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCharacteristic(@PathVariable Long id) {
        characteristicService.deleteCharacteristic(id);
        return ResponseEntity.noContent().build();
    }
}
