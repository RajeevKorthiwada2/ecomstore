package com.ecomstore.service;

import com.ecomstore.dto.CartItemRequest;
import com.ecomstore.exception.BadRequestException;
import com.ecomstore.exception.ResourceNotFoundException;
import com.ecomstore.model.CartItem;
import com.ecomstore.model.Product;
import com.ecomstore.model.User;
import com.ecomstore.repository.CartItemRepository;
import com.ecomstore.repository.ProductRepository;
import com.ecomstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItem> getCart(String userEmail) {
        User user = getUser(userEmail);
        return cartItemRepository.findByUserId(user.getId());
    }

    public CartItem addOrUpdateItem(String userEmail, CartItemRequest request) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));

        if (request.getQuantity() > product.getStockQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .orElse(CartItem.builder().user(user).product(product).quantity(0).build());

        item.setQuantity(request.getQuantity());
        return cartItemRepository.save(item);
    }

    public void removeItem(String userEmail, Long cartItemId) {
        User user = getUser(userEmail);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("This cart item does not belong to you");
        }
        cartItemRepository.delete(item);
    }

    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
