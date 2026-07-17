package com.digitalbooking.repository;

import com.digitalbooking.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    List<Product> findByCategoryTitle(String title);
    Page<Product> findByCategoryTitle(String title, Pageable pageable);

    // Search query: filters by location (optional) and by availability (optional)
    @Query("SELECT p FROM Product p WHERE " +
           "(:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:startDate IS NULL OR :endDate IS NULL OR p.id NOT IN (SELECT b.product.id FROM Booking b WHERE b.startDate <= :endDate AND b.endDate >= :startDate))")
    List<Product> searchProducts(
            @Param("location") String location,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT p FROM Product p WHERE " +
           "(:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:startDate IS NULL OR :endDate IS NULL OR p.id NOT IN (SELECT b.product.id FROM Booking b WHERE b.startDate <= :endDate AND b.endDate >= :startDate))")
    Page<Product> searchProductsPaginated(
            @Param("location") String location,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
