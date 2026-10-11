<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * PRODUCT ENDPOINTS
 */
Route::prefix('products')->group(function () {
    // GET /products - Get all the products of the user
    Route::get('/');

    // GET /products/:id - Get product by id (only if user owns it)
    Route::get('/{id}');

    // POST /products - Post a product for the user
    Route::post('/');

    // PUT /products/:id - Updates the product (only if user owns it)
    Route::put('/{id}');

    // DELETE /products/:id - Deletes the product (only if user owns it)
    Route::delete('/{id}');
});

/**
 * CATEGORIES ENDPOINTS
 */
Route::prefix('categories')->group(function () {
    // GET /categories - Get all the categories
    Route::get('/');

    // POST /categories - Post categories
    Route::post('/');
});

/**
 * ORDERS ENDPOINTS
 */
Route::prefix('orders')->group(function () {
    // GET /orders - Get all the orders of the user
    Route::get('/');

    // GET /orders/:id - Get order by id (only if user owns it)
    Route::get('/{id}');

    // POST /orders - Post order
    Route::post('/');
});
