<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;
use Throwable;

/**
 * Represent an API error with a response status and error code.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class ApiException extends RuntimeException
{
    /**
     * Create an API exception with an optional previous exception.
     *
     * @param string $message Error message for the response.
     * @param string $errorCode Stable identifier for the API error.
     * @param int $status HTTP status code for the response.
     * @param Throwable|null $previous Previous exception in the chain.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(
        string $message,
        public readonly string $errorCode,
        public readonly int $status = 422,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    /**
     * Responds with the exception data
     * @return JsonResponse JSON response containing the error message and code.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function render(): JsonResponse
    {
        return response()->json(array_filter([
            'message' => $this->getMessage(),
            'error'    => $this->errorCode,
        ]), $this->status);
    }
}
