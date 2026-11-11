<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardKpiResource;
use App\Services\DashboardService;
use Illuminate\Http\Request;

/**
 * Handle dashboard summary endpoints.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class DashboardController extends Controller
{
    /**
     * Create the controller with its dashboard service.
     * @param DashboardService $dashboardService Dashboard KPI calculations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private DashboardService $dashboardService) {}

    /**
     * Return the authenticated user's dashboard KPIs.
     * @param Request $request Authenticated request.
     * @return DashboardKpiResource Dashboard KPI values.
     * @throws \App\Exceptions\ApiException when KPI data cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function kpis(Request $request): DashboardKpiResource
    {
        return new DashboardKpiResource(
            $this->dashboardService->getKpis($request->user())
        );
    }
}
