package com.ecomstore.controller;

import com.ecomstore.dto.CartItemRequest;
import com.ecomstore.model.CartItem;
import com.ecomstore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public List<CartItem> getCart(Authentication auth) {
        return cartService.getCart(auth.getName());
    }

    @PostMapping
    public ResponseEntity<CartItem> addOrUpdate(Authentication auth, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addOrUpdateItem(auth.getName(), request));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> remove(Authentication auth, @PathVariable Long cartItemId) {
        cartService.removeItem(auth.getName(), cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
