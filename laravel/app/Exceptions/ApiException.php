<?php

use Illuminate\Http\JsonResponse;

class ApiException extends RuntimeException
{
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
     * @return JsonResponse
     */
    public function render(): JsonResponse
    {
        return response()->json(array_filter([
            'message' => $this->getMessage(),
            'error'    => $this->errorCode,
        ]), $this->status);
    }
}
