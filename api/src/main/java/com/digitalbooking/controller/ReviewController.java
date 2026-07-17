package com.digitalbooking.controller;

import com.digitalbooking.model.Product;
import com.digitalbooking.model.Review;
import com.digitalbooking.repository.ReviewRepository;
import com.digitalbooking.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;

    @Autowired
    public ReviewController(ReviewRepository reviewRepository, ProductService productService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByDateDesc(productId));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@PathVariable Long productId, @RequestBody Review review) {
        Product product;
        try {
            product = productService.getProductById(productId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }

        if (review.getStars() < 1 || review.getStars() > 5) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "La puntuación debe ser entre 1 y 5 estrellas.");
            return ResponseEntity.badRequest().body(response);
        }
        if (review.getUserName() == null || review.getUserName().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "El nombre del usuario es obligatorio.");
            return ResponseEntity.badRequest().body(response);
        }

        review.setProduct(product);
        review.setDate(LocalDate.now());

        Review savedReview = reviewRepository.save(review);

        // Recalculate Product average rating (out of 10.0 by multiplying stars average by 2)
        List<Review> allReviews = reviewRepository.findByProductId(productId);
        double totalStars = 0;
        for (Review r : allReviews) {
            totalStars += r.getStars();
        }
        double averageStars = totalStars / allReviews.size();
        double ratingTenScale = averageStars * 2.0;

        String ratingText = "Aceptable";
        if (ratingTenScale >= 9.6) ratingText = "Excepcional";
        else if (ratingTenScale >= 9.0) ratingText = "Magnífico";
        else if (ratingTenScale >= 8.0) ratingText = "Excelente";
        else if (ratingTenScale >= 7.0) ratingText = "Muy bueno";
        else if (ratingTenScale >= 6.0) ratingText = "Bueno";

        productService.updateProductRating(productId, ratingTenScale, ratingText);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }
}
