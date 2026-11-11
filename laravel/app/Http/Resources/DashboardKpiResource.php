<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose the user's product and sales dashboard indicators.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class DashboardKpiResource extends JsonResource
{
    /**
     * Transform dashboard KPI values into the response array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with total_products, out_of_stock, low_stock, today_orders, and today_revenue.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'total_products' => $this->resource['total_products'],
            'out_of_stock'   => $this->resource['out_of_stock'],
            'low_stock'      => $this->resource['low_stock'],
            'today_orders'   => $this->resource['today_orders'],
            'today_revenue'  => $this->resource['today_revenue'],
        ];
    }
}
