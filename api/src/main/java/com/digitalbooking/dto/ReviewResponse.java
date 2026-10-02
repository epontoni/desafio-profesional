package com.digitalbooking.dto;

import java.time.LocalDate;

public class ReviewResponse {

    private Long id;
    private Integer stars;
    private String comment;
    private String userName;
    private LocalDate date;
    private Long productId;

    public ReviewResponse() {
    }

    public ReviewResponse(Long id, Integer stars, String comment, String userName, LocalDate date, Long productId) {
        this.id = id;
        this.stars = stars;
        this.comment = comment;
        this.userName = userName;
        this.date = date;
        this.productId = productId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
