<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardService
{
    /**
     * Aggregated KPIs for the user's dashboard.
     */
    public function getKpis(User $user): array
    {
        $products = $this->productCounters($user);
        $today = $this->todaySales($user);

        return [
            'total_products' => (int) $products->total,
            'out_of_stock'   => (int) $products->out_of_stock,
            'low_stock'      => (int) $products->low_stock,
            'today_orders'   => (int) $today->orders,
            'today_revenue'  => (string) $today->revenue,
        ];
    }

    /**
     * Returns all the count stats of the user
     */
    private function productCounters(User $user): object
    {
        return Product::where('user_id', $user->id)
            ->selectRaw('COUNT(*) AS total')
            ->selectRaw('COUNT(*) FILTER (WHERE stock = 0) AS out_of_stock')
            ->selectRaw('COUNT(*) FILTER (WHERE stock > 0 AND stock <= 5) AS low_stock')
            ->first();
    }

    /**
     * Returns the today user's sales
     */
    private function todaySales(User $user): object
    {
        return Order::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->selectRaw('COUNT(*) AS orders, COALESCE(SUM(total_price), 0) AS revenue')
            ->first();
    }
}
