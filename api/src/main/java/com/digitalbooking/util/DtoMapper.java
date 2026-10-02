package com.digitalbooking.util;

import com.digitalbooking.dto.*;
import com.digitalbooking.model.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getTitle(),
                category.getDescription(),
                category.getImageUrl()
        );
    }

    public CharacteristicResponse toCharacteristicResponse(Characteristic characteristic) {
        if (characteristic == null) return null;
        return new CharacteristicResponse(
                characteristic.getId(),
                characteristic.getName(),
                characteristic.getIcon()
        );
    }

    public ProductResponse toProductResponse(Product product) {
        if (product == null) return null;
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                toCategoryResponse(product.getCategory()),
                product.getLocation(),
                product.getRating(),
                product.getRatingText(),
                product.getCharacteristics() != null
                        ? product.getCharacteristics().stream().map(this::toCharacteristicResponse).collect(Collectors.toList())
                        : Collections.emptyList(),
                product.getImages() != null ? product.getImages() : Collections.emptyList()
        );
    }

    public BookingResponse toBookingResponse(Booking booking) {
        if (booking == null) return null;
        return new BookingResponse(
                booking.getId(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getEstimatedArrivalTime(),
                booking.getNotes(),
                toProductResponse(booking.getProduct()),
                toUserResponse(booking.getUser())
        );
    }

    public ReviewResponse toReviewResponse(Review review) {
        if (review == null) return null;
        return new ReviewResponse(
                review.getId(),
                review.getStars(),
                review.getComment(),
                review.getUserName(),
                review.getDate(),
                review.getProduct() != null ? review.getProduct().getId() : null
        );
    }

    public FavoriteResponse toFavoriteResponse(Favorite favorite) {
        if (favorite == null) return null;
        return new FavoriteResponse(
                favorite.getId(),
                toProductResponse(favorite.getProduct()),
                favorite.getCreatedAt()
        );
    }
}
