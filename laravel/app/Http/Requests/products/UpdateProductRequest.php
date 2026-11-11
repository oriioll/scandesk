<?php

namespace App\Http\Requests\products;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validate that a product has a name, existing category id, price, stock and the barcode doesn't exist already for that user (ignoring the product being updated)
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class UpdateProductRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string> Rules for required product fields and a unique user barcode excluding this product.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function rules(): array
    {
        return [
            'barcode' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'barcode')
                    ->where('user_id', $this->user()->id)
                    ->whereNull('deleted_at')->ignore($this->route('id')),
            ],
            'name'        => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price'       => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
        ];
    }
}
