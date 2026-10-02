package com.digitalbooking.service;

import com.digitalbooking.dto.ProductRequest;
import com.digitalbooking.dto.ProductResponse;
import com.digitalbooking.exception.BadRequestException;
import com.digitalbooking.exception.DuplicateResourceException;
import com.digitalbooking.exception.ResourceNotFoundException;
import com.digitalbooking.model.Category;
import com.digitalbooking.model.Characteristic;
import com.digitalbooking.model.Product;
import com.digitalbooking.repository.ProductRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final CharacteristicService characteristicService;
    private final DtoMapper dtoMapper;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          CategoryService categoryService,
                          CharacteristicService characteristicService,
                          DtoMapper dtoMapper) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.characteristicService = characteristicService;
        this.dtoMapper = dtoMapper;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(dtoMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getProductsPaginated(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(dtoMapper::toProductResponse);
    }

    public List<ProductResponse> getRandomRecommendations() {
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);
        return allProducts.stream()
                .limit(10)
                .map(dtoMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategoryTitle(String title) {
        return productRepository.findByCategoryTitle(title).stream()
                .map(dtoMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> getProductsByCategoryTitlePaginated(String title, Pageable pageable) {
        return productRepository.findByCategoryTitle(title, pageable)
                .map(dtoMapper::toProductResponse);
    }

    public List<ProductResponse> searchProducts(String location, LocalDate startDate, LocalDate endDate) {
        return productRepository.searchProducts(location, startDate, endDate).stream()
                .map(dtoMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> searchProductsPaginated(String location, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return productRepository.searchProductsPaginated(location, startDate, endDate, pageable)
                .map(dtoMapper::toProductResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = getProductEntityById(id);
        return dtoMapper.toProductResponse(product);
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el id: " + id));
    }

    @Transactional
    public ProductResponse saveProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("El nombre del producto ya está en uso: " + request.getName());
        }

        if (request.getCategoryId() == null) {
            throw new BadRequestException("Debe seleccionar una categoría para el producto.");
        }

        Category category = categoryService.getCategoryEntityById(request.getCategoryId());

        List<Characteristic> characteristics = List.of();
        if (request.getCharacteristicIds() != null && !request.getCharacteristicIds().isEmpty()) {
            characteristics = characteristicService.getCharacteristicEntitiesByIds(request.getCharacteristicIds());
        }

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                category,
                request.getLocation(),
                request.getRating() != null ? request.getRating() : 8.0,
                request.getRatingText() != null ? request.getRatingText() : "Excelente",
                characteristics,
                request.getImages()
        );

        Product saved = productRepository.save(product);
        return dtoMapper.toProductResponse(saved);
    }

    @Transactional
    public void updateProductRating(Long id, Double newRating, String newRatingText) {
        productRepository.findById(id).ifPresent(p -> {
            p.setRating(newRating);
            p.setRatingText(newRatingText);
            productRepository.save(p);
        });
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con el id: " + id);
        }
        productRepository.deleteById(id);
    }
}
