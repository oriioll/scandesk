<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardKpiResource extends JsonResource
{
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
