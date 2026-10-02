package com.digitalbooking.service;

import com.digitalbooking.dto.FavoriteResponse;
import com.digitalbooking.model.Favorite;
import com.digitalbooking.model.Product;
import com.digitalbooking.model.User;
import com.digitalbooking.repository.FavoriteRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductService productService;
    private final UserService userService;
    private final DtoMapper dtoMapper;

    @Autowired
    public FavoriteService(FavoriteRepository favoriteRepository,
                           ProductService productService,
                           UserService userService,
                           DtoMapper dtoMapper) {
        this.favoriteRepository = favoriteRepository;
        this.productService = productService;
        this.userService = userService;
        this.dtoMapper = dtoMapper;
    }

    public List<FavoriteResponse> getUserFavorites(String userEmail) {
        return favoriteRepository.findByUserEmail(userEmail).stream()
                .map(dtoMapper::toFavoriteResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteResponse addFavorite(Long productId, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        Product product = productService.getProductEntityById(productId);

        Optional<Favorite> existing = favoriteRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) {
            return dtoMapper.toFavoriteResponse(existing.get());
        }

        Favorite favorite = new Favorite(user, product);
        Favorite saved = favoriteRepository.save(favorite);
        return dtoMapper.toFavoriteResponse(saved);
    }

    @Transactional
    public void removeFavorite(Long productId, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public boolean isFavorite(Long productId, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        return favoriteRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
}
