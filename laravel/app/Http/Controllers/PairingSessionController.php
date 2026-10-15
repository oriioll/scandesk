<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifySessionRequest;
use App\Http\Resources\PairingSessionResource;
use App\Http\Resources\SessionExistsResource;
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

    /**
     * Handles a POST request to verify if a pairing session exists
     * @param VerifySessionRequest $request The API request body with the token of the session
     * @return SessionExistsResource|\Illuminate\Http\JsonResponse If session exists or not
     */
    public function verify(VerifySessionRequest $request)
    {
        $session = $this->pairingSessionService->verifySession($request->validated());
        if (!$session) {
            return SessionExistsResource::make(['exists' => true, 'message' => 'Session not found'])->response()->setStatusCode(404);
        }
        return SessionExistsResource::make(['exists' => true, 'message' => 'Session found successfully']);
    }
}
