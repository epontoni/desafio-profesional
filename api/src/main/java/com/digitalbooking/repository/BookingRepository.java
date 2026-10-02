package com.digitalbooking.repository;

import com.digitalbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByProductId(Long productId);

    List<Booking> findByProductIdOrderByStartDateDesc(Long productId);

    List<Booking> findAllByOrderByStartDateDesc();

    List<Booking> findByUserEmailOrderByStartDateDesc(String email);

    // Checks if there is any booking for a product overlapping with the given range [startDate, endDate]
    @Query("SELECT b FROM Booking b WHERE b.product.id = :productId AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Booking> findOverlappingBookings(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
