# DAILY Marketplace

## Domain model

The marketplace is modeled around Store, Seller, Product, ProductVariant, Category, ProductImage, Inventory, Cart, Order, OrderItem, Review, Coupon, and Delivery. Product images reference CDN-ready media assets. Inventory is owned by the seller and updated through server-side transactions with row/version locking to prevent overselling.

## Discovery and cart

Marketplace search uses the existing provider abstraction and cursor pagination. Filters cover price, category, rating, availability, delivery, and seller. Cart state is account-scoped and syncs across devices. Prices, stock, discounts, coupons, delivery fees, and totals are recalculated on the server during checkout.

## Checkout and payments

The secure flow is Marketplace → Checkout → DAILY Payment Layer → provider → signed webhook → transaction → order confirmation. A failed or unverified payment never confirms an order. Sellers never see payment credentials. Idempotency keys and audit events protect checkout retries.

## Orders and delivery

Order states are PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, and REFUNDED. Delivery is an adapter for pickup, seller delivery, or third-party courier. Tracking events include courier assignment, pickup, on-the-way, and delivery. Seller chat can carry product cards, order details, payment state, and delivery updates.

## Trust and scale

Seller verification, product moderation, verified-purchase reviews, report flows, rate limits, refund abuse protection, Redis caching, PostgreSQL indexes, async order events, queue workers, inventory locking, CDN media, and horizontal services are required production adapters.

## Current UI status

The web MVP includes marketplace discovery, search, categories, featured products, product details, seller chat affordance, cart, checkout, server-side total/security notices, payment confirmation architecture, order history, delivery status, and verified seller indicators.
