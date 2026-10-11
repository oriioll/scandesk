<?php

namespace App\Exceptions;

use Exception;

class AppException extends Exception
{
    protected int $status = 500;
    public function status(): int
    {
        return $this->status;
    }
}
