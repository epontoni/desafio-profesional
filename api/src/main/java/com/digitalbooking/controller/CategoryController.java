package com.digitalbooking.controller;

import com.digitalbooking.model.Category;
import com.digitalbooking.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (categoryRepository.existsByTitle(category.getTitle())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "La categoría ya existe con el título proporcionado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryRepository.findById(id).map(existing -> {
            // Check if title changed and exists
            if (!existing.getTitle().equals(categoryDetails.getTitle()) && 
                    categoryRepository.existsByTitle(categoryDetails.getTitle())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Ya existe otra categoría con ese título");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            existing.setTitle(categoryDetails.getTitle());
            existing.setDescription(categoryDetails.getDescription());
            existing.setImageUrl(categoryDetails.getImageUrl());
            Category updated = categoryRepository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
