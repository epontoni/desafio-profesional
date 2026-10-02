package com.digitalbooking.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Map;

public class BookingRequest {

    @NotNull(message = "La fecha de inicio (check-in) es obligatoria.")
    private LocalDate startDate;

    @NotNull(message = "La fecha de fin (check-out) es obligatoria.")
    private LocalDate endDate;

    @NotBlank(message = "El horario estimado de llegada es obligatorio.")
    private String estimatedArrivalTime;

    private String notes;

    private Long productId;

    private Long userId;

    public BookingRequest() {
    }

    public BookingRequest(LocalDate startDate, LocalDate endDate, String estimatedArrivalTime, String notes, Long productId, Long userId) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.estimatedArrivalTime = estimatedArrivalTime;
        this.notes = notes;
        this.productId = productId;
        this.userId = userId;
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

    public Long getProductId() {
        return productId;
    }

    @JsonSetter("productId")
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    @JsonSetter("product")
    public void setProduct(Object prod) {
        if (prod instanceof Map<?, ?> map) {
            Object idVal = map.get("id");
            if (idVal != null) {
                this.productId = Long.valueOf(idVal.toString());
            }
        } else if (prod instanceof Number num) {
            this.productId = num.longValue();
        }
    }

    public Long getUserId() {
        return userId;
    }

    @JsonSetter("userId")
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @JsonSetter("user")
    public void setUser(Object usr) {
        if (usr instanceof Map<?, ?> map) {
            Object idVal = map.get("id");
            if (idVal != null) {
                this.userId = Long.valueOf(idVal.toString());
            }
        } else if (usr instanceof Number num) {
            this.userId = num.longValue();
        }
    }
}
