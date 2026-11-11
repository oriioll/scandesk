<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifySessionRequest;
use App\Http\Resources\PairingSessionResource;
use App\Http\Resources\SessionExistsResource;
use App\Services\PairingSessionService;
use Illuminate\Http\Request;

/**
 * Handle pairing-session creation and verification endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class PairingSessionController extends Controller
{
    /**
     * Create the controller with its pairing-session service.
     *
     * @param PairingSessionService $pairingSessionService Pairing-session operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private PairingSessionService $pairingSessionService) {}
    /**
     * Handles a POST request of a pairing session
     *
     * @param Request $request Authenticated request.
     * @return PairingSessionResource Created pairing session.
     * @throws \App\Exceptions\ApiException when session creation fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function store(Request $request): PairingSessionResource
    {
        return PairingSessionResource::make(
            $this->pairingSessionService->createSession($request->user())
        );
    }

    /**
     * Handles a POST request to verify if a pairing session exists
     *
     * @param VerifySessionRequest $request Validated session token.
     * @return SessionExistsResource|\Illuminate\Http\JsonResponse Whether the session exists, with a not-found status when absent.
     * @throws \App\Exceptions\ApiException when session verification fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function verify(VerifySessionRequest $request)
    {
        $session = $this->pairingSessionService->verifySession($request->validated('token_hash'));
        if (!$session) {
            return SessionExistsResource::make(['exists' => false, 'message' => 'Session not found'])->response()->setStatusCode(404);
        }
        return SessionExistsResource::make(['exists' => true, 'message' => 'Session found successfully']);
    }
}
