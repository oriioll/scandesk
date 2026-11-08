<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardKpiResource;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function kpis(Request $request): DashboardKpiResource
    {
        return new DashboardKpiResource(
            $this->dashboardService->getKpis($request->user())
        );
    }
}
