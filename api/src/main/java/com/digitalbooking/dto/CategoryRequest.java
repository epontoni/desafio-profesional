package com.digitalbooking.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {

    @NotBlank(message = "El título de la categoría es obligatorio.")
    private String title;

    @NotBlank(message = "La descripción de la categoría es obligatoria.")
    private String description;

    @NotBlank(message = "La URL de la imagen es obligatoria.")
    private String imageUrl;

    public CategoryRequest() {
    }

    public CategoryRequest(String title, String description, String imageUrl) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
