<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Represent an authenticated user and owned application records.
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $token
 * @property \Illuminate\Support\Carbon|null $last_login
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Product> $products
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Order> $orders
 * @property-read \Illuminate\Database\Eloquent\Collection<int, StockHistory> $stockHistories
 * @property-read \Illuminate\Database\Eloquent\Collection<int, PairingSession> $pairingSessions
 * @author Oriol Plazas
 * @since 1.0.0
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
    protected $hidden = ['password', 'token'];
    /**
     * Get the products owned by this user.
     * @return HasMany<Product> Product relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
    /**
     * Get the orders placed by this user.
     * @return HasMany<Order> Order relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
    /**
     * Get the stock-history records created for this user.
     * @return HasMany<StockHistory> Stock-history relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class);
    }
    /**
     * Get the pairing sessions created by this user.
     * @return HasMany<PairingSession> Pairing-session relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function pairingSessions(): HasMany
    {
        return $this->hasMany(PairingSession::class);
    }


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string> Attribute cast definitions.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    protected function casts(): array
    {
        return [
            'last_login' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
