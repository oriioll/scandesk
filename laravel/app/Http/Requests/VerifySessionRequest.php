<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validate the pairing-session verification token.
 * Validate that a product has a name, existing category id, price, stock and the barcode doesn't exists already for that user
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class VerifySessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool Whether the request is authorized.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string> Rules requiring a string token hash.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function rules(): array
    {
        return [
            'token_hash'        => ['required', 'string', 'max:255'],
        ];
    }
}
