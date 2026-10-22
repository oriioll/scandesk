<?php

namespace App\Http\Requests\orders;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Add the idempotency header to the validated request data.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'idempotency_key' => $this->header('Idempotency-Key'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'idempotency_key'     => ['required', 'string', 'max:64'],
            'items'               => ['required', 'array', 'min:1'],
            'items.*'             => ['required', 'array:product_id,quantity'],
            'items.*.product_id'  => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where('user_id', $this->user()->id),
            ],
            'items.*.quantity'    => ['required', 'integer', 'min:1'],
        ];
    }
}
