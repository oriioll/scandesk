<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

/**
 * Calculate product and sales indicators for the dashboard.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class DashboardService
{
    /**
     * Aggregated KPIs for the user's dashboard.
     *
     * @param User $user Owner whose dashboard data is requested.
     * @return array{total_products: int, out_of_stock: int, low_stock: int, today_orders: int, today_revenue: string} Dashboard indicator values.
     * @throws ApiException when KPI data cannot be calculated.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function getKpis(User $user): array
    {
        try {
            $products = $this->productCounters($user);
            $today = $this->todaySales($user);

            return [
                'total_products' => (int) ($products->total ?? 0),
                'out_of_stock'   => (int) ($products->out_of_stock ?? 0),
                'low_stock'      => (int) ($products->low_stock ?? 0),
                'today_orders'   => (int) ($today->orders ?? 0),
                'today_revenue'  => (string) ($today->revenue ?? '0.00'),
            ];
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while calculating KPIs.',
                errorCode: 'DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while processing KPI data.',
                errorCode: 'INTERNAL_SERVER_ERROR',
                status: 500,
                previous: $e
            );
        }
    }

    /**
     * Returns all the count stats of the user
     *
     * @param User $user Owner whose product counts are requested.
     * @return object Aggregate row containing total, out-of-stock, and low-stock counts.
     * @throws QueryException when the product counts cannot be queried.
     * @author Oriol Plazas
     * @since 1.0.0
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
     *
     * @param User $user Owner whose sales are requested.
     * @return object Aggregate row containing today's order count and revenue.
     * @throws QueryException when today's sales cannot be queried.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    private function todaySales(User $user): object
    {
        return Order::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->selectRaw('COUNT(*) AS orders, COALESCE(SUM(total_price), 0) AS revenue')
            ->first();
    }
}
