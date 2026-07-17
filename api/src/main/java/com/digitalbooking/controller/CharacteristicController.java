package com.digitalbooking.controller;

import com.digitalbooking.model.Characteristic;
import com.digitalbooking.repository.CharacteristicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characteristics")
@CrossOrigin(origins = "*")
public class CharacteristicController {

    private final CharacteristicRepository characteristicRepository;

    @Autowired
    public CharacteristicController(CharacteristicRepository characteristicRepository) {
        this.characteristicRepository = characteristicRepository;
    }

    @GetMapping
    public ResponseEntity<List<Characteristic>> getAllCharacteristics() {
        return ResponseEntity.ok(characteristicRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createCharacteristic(@RequestBody Characteristic characteristic) {
        if (characteristicRepository.existsByName(characteristic.getName())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "La característica ya existe con el nombre proporcionado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        Characteristic saved = characteristicRepository.save(characteristic);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCharacteristic(@PathVariable Long id, @RequestBody Characteristic details) {
        return characteristicRepository.findById(id).map(existing -> {
            if (!existing.getName().equals(details.getName()) && 
                    characteristicRepository.existsByName(details.getName())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Ya existe otra característica con ese nombre");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            existing.setName(details.getName());
            existing.setIcon(details.getIcon());
            Characteristic updated = characteristicRepository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCharacteristic(@PathVariable Long id) {
        if (!characteristicRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        characteristicRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
