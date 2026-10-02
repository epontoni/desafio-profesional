package com.digitalbooking.repository;

import com.digitalbooking.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    List<Favorite> findByUserEmail(String email);
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    Optional<Favorite> findByUserEmailAndProductId(String email, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserEmailAndProductId(String email, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserEmailAndProductId(String email, Long productId);
}
