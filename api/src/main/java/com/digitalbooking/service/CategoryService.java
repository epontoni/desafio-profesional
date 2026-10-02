package com.digitalbooking.service;

import com.digitalbooking.dto.CategoryRequest;
import com.digitalbooking.dto.CategoryResponse;
import com.digitalbooking.exception.DuplicateResourceException;
import com.digitalbooking.exception.ResourceNotFoundException;
import com.digitalbooking.model.Category;
import com.digitalbooking.repository.CategoryRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final DtoMapper dtoMapper;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, DtoMapper dtoMapper) {
        this.categoryRepository = categoryRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(dtoMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = getCategoryEntityById(id);
        return dtoMapper.toCategoryResponse(category);
    }

    public Category getCategoryEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException("La categoría ya existe con el título proporcionado.");
        }

        Category category = new Category(
                request.getTitle(),
                request.getDescription(),
                request.getImageUrl()
        );

        Category saved = categoryRepository.save(category);
        return dtoMapper.toCategoryResponse(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category existing = getCategoryEntityById(id);

        if (!existing.getTitle().equalsIgnoreCase(request.getTitle()) &&
                categoryRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException("Ya existe otra categoría con el título: " + request.getTitle());
        }

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setImageUrl(request.getImageUrl());

        Category updated = categoryRepository.save(existing);
        return dtoMapper.toCategoryResponse(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
