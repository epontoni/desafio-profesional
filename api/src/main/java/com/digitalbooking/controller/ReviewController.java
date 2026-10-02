package com.digitalbooking.controller;

import com.digitalbooking.dto.ReviewRequest;
import com.digitalbooking.dto.ReviewResponse;
import com.digitalbooking.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@PathVariable Long productId,
                                                       @Valid @RequestBody ReviewRequest request) {
        ReviewResponse savedReview = reviewService.createReview(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }
}
