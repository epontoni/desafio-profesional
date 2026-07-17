package com.digitalbooking.service;

import com.digitalbooking.model.Product;
import com.digitalbooking.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<Product> getProductsPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> getRandomRecommendations() {
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);
        return allProducts.stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Product> getProductsByCategoryTitle(String title) {
        return productRepository.findByCategoryTitle(title);
    }

    public Page<Product> getProductsByCategoryTitlePaginated(String title, Pageable pageable) {
        return productRepository.findByCategoryTitle(title, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con el id: " + id));
    }

    public Product saveProduct(Product product) {
        if (productRepository.existsByName(product.getName())) {
            throw new IllegalArgumentException("El nombre del producto ya está en uso");
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Producto no encontrado con el id: " + id);
        }
        productRepository.deleteById(id);
    }
}
