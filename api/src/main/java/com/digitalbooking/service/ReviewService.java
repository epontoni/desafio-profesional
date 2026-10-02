package com.digitalbooking.service;

import com.digitalbooking.dto.ReviewRequest;
import com.digitalbooking.dto.ReviewResponse;
import com.digitalbooking.exception.BadRequestException;
import com.digitalbooking.model.Product;
import com.digitalbooking.model.Review;
import com.digitalbooking.repository.ReviewRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final DtoMapper dtoMapper;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductService productService, DtoMapper dtoMapper) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.dtoMapper = dtoMapper;
    }

    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdOrderByDateDesc(productId).stream()
                .map(dtoMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(Long productId, ReviewRequest request) {
        Product product = productService.getProductEntityById(productId);

        if (request.getStars() == null || request.getStars() < 1 || request.getStars() > 5) {
            throw new BadRequestException("La puntuación debe ser entre 1 y 5 estrellas.");
        }
        if (request.getUserName() == null || request.getUserName().trim().isEmpty()) {
            throw new BadRequestException("El nombre del usuario es obligatorio.");
        }

        Review review = new Review(
                request.getStars(),
                request.getComment(),
                request.getUserName(),
                LocalDate.now(),
                product
        );

        Review savedReview = reviewRepository.save(review);

        // Recalculate Product average rating (out of 10.0 scale by multiplying 5-stars average by 2)
        List<Review> allReviews = reviewRepository.findByProductId(productId);
        double totalStars = 0;
        for (Review r : allReviews) {
            totalStars += r.getStars();
        }
        double averageStars = totalStars / allReviews.size();
        double ratingTenScale = Math.round((averageStars * 2.0) * 10.0) / 10.0;

        String ratingText = "Aceptable";
        if (ratingTenScale >= 9.6) ratingText = "Excepcional";
        else if (ratingTenScale >= 9.0) ratingText = "Magnífico";
        else if (ratingTenScale >= 8.0) ratingText = "Excelente";
        else if (ratingTenScale >= 7.0) ratingText = "Muy bueno";
        else if (ratingTenScale >= 6.0) ratingText = "Bueno";

        productService.updateProductRating(productId, ratingTenScale, ratingText);

        return dtoMapper.toReviewResponse(savedReview);
    }
}
