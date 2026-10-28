<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PairingSessionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/**
 * Verify login middleware
 */
Route::middleware('auth:sanctum')->group(function () {
    /**
     * AUTH ENDPOINTS
     */
    Route::prefix('auth')->group(function () {
        // GET /auth/me - Gets information of the current logged user
        Route::get('/me');

        // POST /auth/logout - Logs out a user
        Route::post('/logout');
    });

    /**
     * PRODUCT ENDPOINTS
     */
    Route::prefix('products')->group(function () {
        // GET /products - Get all the products of the user
        Route::get('/', [ProductController::class, 'index']);

        // GET /products/:id - Get product by id (only if user owns it)
        Route::get('/{id}');

        // GET /products/:barcode - Get product by barcode (only if user owns it)
        Route::get('/barcode/{barcode}', [ProductController::class, 'showByBarcode']);

        // POST /products - Post a product for the user
        Route::post('/', [ProductController::class, 'store']);

        // PUT /products/:id - Updates the product (only if user owns it)
        Route::put('/{id}', [ProductController::class, 'update']);

        // DELETE /products/:id - Deletes the product (only if user owns it)
        Route::delete('/{id}');
    });

    /**
     * CATEGORIES ENDPOINTS
     */
    Route::prefix('categories')->group(function () {
        // GET /categories - Get all the categories
        Route::get('/', [CategoryController::class, 'index']);

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
        Route::post('/', [OrderController::class, 'store']);
    });

    /**
     * HISTORY ENDPOINTS
     */
    Route::prefix('history')->group(function () {
        // GET /history/products - Get the history of all the product changes for user
        Route::get('/products');
    });

    /**
     * SYNC ENDPOINTS
     */
    Route::prefix('sync')->group(function () {
        // POST /sync/pair-code - create sync session and return token of the session
        Route::post('/pair-code', [PairingSessionController::class, 'store']);

        // POST /sync/close-conn - Closes the current connection
        Route::post('/close-conn');
    });
});
/**
 * AUTH ENDPOINTS
 */
Route::prefix('auth')->group(function () {
    // POST /auth/login - Logs in a user
    Route::post('/login', [UserController::class, 'login']);

    // POST /auth/register - Registers a user
    Route::post('/register', [UserController::class, 'register']);
});

/**
 * SYNC ENDPOINTS
 */
Route::prefix('sync')->group(function () {
    // POST /sync/verify - sent from phone, verify that exists a session with that code
    //Rate limit: 10 x minute
    Route::post('/verify', [PairingSessionController::class, 'verify'])->middleware('throttle:10,1');
});
