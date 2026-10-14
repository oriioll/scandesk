<?php

namespace App\Http\Controllers;

use App\Http\Resources\PairingSessionResource;
use App\Services\PairingSessionService;
use Illuminate\Http\Request;

class PairingSessionController extends Controller
{
    public function __construct(private PairingSessionService $pairingSessionService) {}
    /**
     * Handles a POST request of a pairing session
     * @param Request $request
     * @return PairingSessionResource
     */
    public function store(Request $request): PairingSessionResource
    {
        return PairingSessionResource::make(
            $this->pairingSessionService->createSession($request->user())
        );
    }
}
