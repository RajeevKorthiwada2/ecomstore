package com.ecomstore.service;

import com.ecomstore.dto.ProductRequest;
import com.ecomstore.exception.ResourceNotFoundException;
import com.ecomstore.model.Category;
import com.ecomstore.model.Product;
import com.ecomstore.repository.CategoryRepository;
import com.ecomstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> list(String search, Long categoryId, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search, pageable);
        }
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product get(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public Product create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .build();
        applyCategory(product, request.getCategoryId());
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = get(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        applyCategory(product, request.getCategoryId());
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.delete(get(id));
    }

    private void applyCategory(Product product, Long categoryId) {
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
            product.setCategory(category);
        }
    }
}
