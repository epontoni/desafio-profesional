package com.digitalbooking.dto;

import java.util.ArrayList;
import java.util.List;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private CategoryResponse category;
    private String location;
    private Double rating;
    private String ratingText;
    private List<CharacteristicResponse> characteristics = new ArrayList<>();
    private List<String> images = new ArrayList<>();

    public ProductResponse() {
    }

    public ProductResponse(Long id, String name, String description, CategoryResponse category, String location, Double rating, String ratingText, List<CharacteristicResponse> characteristics, List<String> images) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.location = location;
        this.rating = rating;
        this.ratingText = ratingText;
        this.characteristics = characteristics != null ? characteristics : new ArrayList<>();
        this.images = images != null ? images : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryResponse getCategory() {
        return category;
    }

    public void setCategory(CategoryResponse category) {
        this.category = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getRatingText() {
        return ratingText;
    }

    public void setRatingText(String ratingText) {
        this.ratingText = ratingText;
    }

    public List<CharacteristicResponse> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(List<CharacteristicResponse> characteristics) {
        this.characteristics = characteristics;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
