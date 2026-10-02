package com.digitalbooking.dto;

import jakarta.validation.constraints.NotNull;

public class FavoriteRequest {

    @NotNull(message = "El id del producto es obligatorio.")
    private Long productId;

    public FavoriteRequest() {
    }

    public FavoriteRequest(Long productId) {
        this.productId = productId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
