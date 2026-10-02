package com.digitalbooking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReviewRequest {

    @NotNull(message = "La puntuación es obligatoria.")
    @Min(value = 1, message = "La puntuación mínima es 1 estrella.")
    @Max(value = 5, message = "La puntuación máxima es 5 estrellas.")
    private Integer stars;

    @NotBlank(message = "El comentario es obligatorio.")
    @Size(max = 1000, message = "El comentario no puede exceder los 1000 caracteres.")
    private String comment;

    @NotBlank(message = "El nombre del usuario es obligatorio.")
    private String userName;

    public ReviewRequest() {
    }

    public ReviewRequest(Integer stars, String comment, String userName) {
        this.stars = stars;
        this.comment = comment;
        this.userName = userName;
    }

    public Integer getStars() {
        return stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
