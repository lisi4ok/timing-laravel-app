<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTimingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'egn' => ['required', 'numeric', 'digits:10'],
            'email' => ['nullable', 'string', 'max:255', 'email'],
            'phone' => ['nullable', 'numeric'],
            'description' => ['nullable', 'string'],
            'date' => [
                'required',
                Rule::date()->after(now()),
            ],
            'value' => 'required|string',
        ];
    }
}
