<?php

namespace App\Http\Requests\auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Validate the name, email, and password required to register an account.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class RegisterUserRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string> Rules for account registration fields.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:50', 'regex:/^(?=.*[0-9])(?=.*[^\p{L}\p{N}\s])\S+$/u'],
        ];
    }
}
