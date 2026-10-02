package com.digitalbooking.dto;

import java.time.LocalDateTime;

public class FavoriteResponse {

    private Long id;
    private ProductResponse product;
    private LocalDateTime createdAt;

    public FavoriteResponse() {
    }

    public FavoriteResponse(Long id, ProductResponse product, LocalDateTime createdAt) {
        this.id = id;
        this.product = product;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductResponse getProduct() {
        return product;
    }

    public void setProduct(ProductResponse product) {
        this.product = product;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
