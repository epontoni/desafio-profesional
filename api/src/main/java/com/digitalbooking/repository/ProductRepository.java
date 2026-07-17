package com.digitalbooking.repository;

import com.digitalbooking.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    List<Product> findByCategoryTitle(String title);
    Page<Product> findByCategoryTitle(String title, Pageable pageable);
}
