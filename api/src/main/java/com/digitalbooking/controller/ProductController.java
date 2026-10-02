package com.digitalbooking.controller;

import com.digitalbooking.dto.ProductRequest;
import com.digitalbooking.dto.ProductResponse;
import com.digitalbooking.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(@RequestParam(required = false) String categoryTitle) {
        if (categoryTitle != null && !categoryTitle.trim().isEmpty()) {
            return ResponseEntity.ok(productService.getProductsByCategoryTitle(categoryTitle));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/random")
    public ResponseEntity<List<ProductResponse>> getRandomRecommendations() {
        return ResponseEntity.ok(productService.getRandomRecommendations());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<ProductResponse>> getProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String categoryTitle) {
        Pageable pageable = PageRequest.of(page, size);
        if (categoryTitle != null && !categoryTitle.trim().isEmpty()) {
            return ResponseEntity.ok(productService.getProductsByCategoryTitlePaginated(categoryTitle, pageable));
        }
        return ResponseEntity.ok(productService.getProductsPaginated(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(productService.searchProducts(location, startDate, endDate));
    }

    @GetMapping("/search/page")
    public ResponseEntity<Page<ProductResponse>> searchProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.searchProductsPaginated(location, startDate, endDate, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse savedProduct = productService.saveProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
