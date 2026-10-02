package com.digitalbooking.dto;

import java.time.LocalDate;

public class BookingResponse {

    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String estimatedArrivalTime;
    private String notes;
    private ProductResponse product;
    private UserResponse user;

    public BookingResponse() {
    }

    public BookingResponse(Long id, LocalDate startDate, LocalDate endDate, String estimatedArrivalTime, String notes, ProductResponse product, UserResponse user) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.estimatedArrivalTime = estimatedArrivalTime;
        this.notes = notes;
        this.product = product;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getEstimatedArrivalTime() {
        return estimatedArrivalTime;
    }

    public void setEstimatedArrivalTime(String estimatedArrivalTime) {
        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ProductResponse getProduct() {
        return product;
    }

    public void setProduct(ProductResponse product) {
        this.product = product;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
