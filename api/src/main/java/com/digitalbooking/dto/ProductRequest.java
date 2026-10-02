package com.digitalbooking.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductRequest {

    @NotBlank(message = "El nombre del alojamiento es obligatorio.")
    private String name;

    @NotBlank(message = "La descripción es obligatoria.")
    private String description;

    private Long categoryId;

    @NotBlank(message = "La ubicación es obligatoria.")
    private String location;

    @NotNull(message = "La puntuación es obligatoria.")
    private Double rating = 8.0;
    private String ratingText = "Excelente";

    private List<Long> characteristicIds = new ArrayList<>();

    @NotEmpty(message = "Debe añadir al menos una URL de imagen válida.")
    private List<String> images = new ArrayList<>();

    public ProductRequest() {
    }

    public ProductRequest(String name, String description, Long categoryId, String location, Double rating, String ratingText, List<Long> characteristicIds, List<String> images) {
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.location = location;
        this.rating = rating;
        this.ratingText = ratingText;
        this.characteristicIds = characteristicIds != null ? characteristicIds : new ArrayList<>();
        this.images = images != null ? images : new ArrayList<>();
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

    public Long getCategoryId() {
        return categoryId;
    }

    @JsonSetter("categoryId")
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @JsonSetter("category")
    public void setCategory(Object cat) {
        if (cat instanceof Map<?, ?> map) {
            Object idVal = map.get("id");
            if (idVal != null) {
                this.categoryId = Long.valueOf(idVal.toString());
            }
        } else if (cat instanceof Number num) {
            this.categoryId = num.longValue();
        }
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
        this.rating = rating != null ? rating : 8.0;
    }

    public String getRatingText() {
        return ratingText;
    }

    public void setRatingText(String ratingText) {
        this.ratingText = ratingText;
    }

    public List<Long> getCharacteristicIds() {
        return characteristicIds;
    }

    @JsonSetter("characteristicIds")
    public void setCharacteristicIds(List<Long> characteristicIds) {
        this.characteristicIds = characteristicIds != null ? characteristicIds : new ArrayList<>();
    }

    @JsonSetter("characteristics")
    public void setCharacteristics(List<?> chars) {
        if (chars != null) {
            this.characteristicIds = new ArrayList<>();
            for (Object obj : chars) {
                if (obj instanceof Map<?, ?> map) {
                    Object idVal = map.get("id");
                    if (idVal != null) {
                        this.characteristicIds.add(Long.valueOf(idVal.toString()));
                    }
                } else if (obj instanceof Number num) {
                    this.characteristicIds.add(num.longValue());
                }
            }
        }
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images != null ? images : new ArrayList<>();
    }
}
