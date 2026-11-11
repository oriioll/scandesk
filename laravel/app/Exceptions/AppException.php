<?php

namespace App\Exceptions;

use Exception;

/**
 * Base exception carrying an HTTP status code.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class AppException extends Exception
{
    protected int $status = 500;
    /**
     * Get the HTTP status code for the exception.
     *
     * @return int HTTP status code.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function status(): int
    {
        return $this->status;
    }
}
