<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PairingSessionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/**
 * Define API endpoints for authentication and user data.
 * @author Oriol Plazas
 * @since 1.0.0
 */
/**
 * Verify login middleware
 */
// Authenticated endpoints for the current user.
Route::middleware('auth:sanctum')->group(function () {
    /**
     * DASHBOARD ENDPOINTS
     */
    // Dashboard summary endpoints.
    Route::prefix('dashboard')->group(function () {
        // GET /dashboard/kpis - Gets the kpis info of the current user
        Route::get('/kpis', [DashboardController::class, 'kpis']);
        // GET /dashboard/doughnut-graph - Gets the stats for the doughnut-graph of the current user
        Route::get('/doughnut-graph', [DashboardController::class, 'doughnutGraph']);
    });

    /**
     * AUTH ENDPOINTS
     */
    // Authenticated account endpoints.
    Route::prefix('auth')->group(function () {
        // GET /auth/me - Gets information of the current logged user
        Route::get('/me', [UserController::class, 'me']);

        // POST /auth/logout - Logs out a user
        Route::post('/logout', [UserController::class, 'logout']);
    });

    /**
     * PRODUCT ENDPOINTS
     */
    // Product management endpoints.
    Route::prefix('products')->group(function () {
        // GET /products - Get all the products of the user
        Route::get('/', [ProductController::class, 'index']);

        // GET /products/:id - Get product by id (only if user owns it)
        Route::get('/{id}', [ProductController::class, 'show']);

        // GET /products/:barcode - Get product by barcode (only if user owns it)
        Route::get('/barcode/{barcode}', [ProductController::class, 'showByBarcode']);

        // POST /products - Post a product for the user
        Route::post('/', [ProductController::class, 'store']);

        // PUT /products/:id - Updates the product (only if user owns it)
        Route::put('/{id}', [ProductController::class, 'update']);

        // DELETE /products/:id - Deletes the product (only if user owns it)
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    /**
     * CATEGORIES ENDPOINTS
     */
    // Product category endpoints.
    Route::prefix('categories')->group(function () {
        // GET /categories - Get all the categories
        Route::get('/', [CategoryController::class, 'index']);

        // POST /categories - Post categories
        Route::post('/');
    });

    /**
     * ORDERS ENDPOINTS
     */
    // Order creation and retrieval endpoints.
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
    // Product change-history endpoints.
    Route::prefix('history')->group(function () {
        // GET /history/products - Get the history of all the product changes for user
        Route::get('/products', [HistoryController::class, 'index']);
    });

    /**
     * SYNC ENDPOINTS
     */
    // Device pairing endpoints for authenticated users.
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
// Public account authentication endpoints.
Route::prefix('auth')->group(function () {
    // POST /auth/login - Logs in a user
    Route::post('/login', [UserController::class, 'login'])->middleware('throttle:5,1');

    // POST /auth/register - Registers a user
    Route::post('/register', [UserController::class, 'register']);
});

/**
 * SYNC ENDPOINTS
 */
// Public device pairing verification endpoint.
Route::prefix('sync')->group(function () {
    // POST /sync/verify - sent from phone, verify that exists a session with that code
    //Rate limit: 10 x minute
    Route::post('/verify', [PairingSessionController::class, 'verify'])->middleware('throttle:10,1');
});
