--liquibase formatted sql

--changeset ecomstore:1-initial-schema
CREATE TABLE users (
                       id BIGINT NOT NULL AUTO_INCREMENT,
                       created_at DATETIME(6),
                       email VARCHAR(255) NOT NULL,
                       full_name VARCHAR(255),
                       password VARCHAR(255) NOT NULL,
                       PRIMARY KEY (id),
                       UNIQUE KEY uk_users_email (email)
);

CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL,
                            roles ENUM('ROLE_USER','ROLE_ADMIN'),
                            CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE categories (
                            id BIGINT NOT NULL AUTO_INCREMENT,
                            description VARCHAR(255),
                            name VARCHAR(255) NOT NULL,
                            PRIMARY KEY (id),
                            UNIQUE KEY uk_categories_name (name)
);

CREATE TABLE products (
                          id BIGINT NOT NULL AUTO_INCREMENT,
                          created_at DATETIME(6),
                          description VARCHAR(2000),
                          image_url VARCHAR(255),
                          name VARCHAR(255),
                          price DECIMAL(38,2) NOT NULL,
                          stock_quantity INT NOT NULL,
                          category_id BIGINT,
                          PRIMARY KEY (id),
                          CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE cart_items (
                            id BIGINT NOT NULL AUTO_INCREMENT,
                            quantity INT,
                            product_id BIGINT NOT NULL,
                            user_id BIGINT NOT NULL,
                            PRIMARY KEY (id),
                            CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products (id),
                            CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE orders (
                        id BIGINT NOT NULL AUTO_INCREMENT,
                        created_at DATETIME(6),
                        shipping_address VARCHAR(255),
                        status ENUM('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED'),
                        total_amount DECIMAL(38,2) NOT NULL,
                        user_id BIGINT NOT NULL,
                        PRIMARY KEY (id),
                        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
                             id BIGINT NOT NULL AUTO_INCREMENT,
                             price_at_purchase DECIMAL(38,2),
                             product_name VARCHAR(255),
                             quantity INT,
                             order_id BIGINT NOT NULL,
                             product_id BIGINT NOT NULL,
                             PRIMARY KEY (id),
                             CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id),
                             CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);