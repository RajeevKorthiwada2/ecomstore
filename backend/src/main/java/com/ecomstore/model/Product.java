package com.ecomstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Column(length = 2000)
    private String description;

    @PositiveOrZero
    @Column(nullable = false)
    private BigDecimal price;

    @PositiveOrZero
    @Column(nullable = false)
    private Integer stockQuantity;

    // Image is stored in S3; this field just holds the object URL/key
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER) // not urgent: EAGER is a fine, simple fix for a project like this, but in a bigger production app you'd normally keep it LAZY and use a DTO/projection instead of returning entities directly — avoids accidentally loading more data than needed on every query. Good enough to mention if this comes up in an interview
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
