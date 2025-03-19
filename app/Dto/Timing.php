<?php

namespace App\Dto;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;

class Timing
{
    public function __construct(
        public string $name,
        public string $egn,
        public \DateTimeInterface | CarbonInterface | string $value,
        public ?string $email = null,
        public ?int $phone = null,
        public ?string $description = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        if (is_string($data['value'])) {
            $data['value'] = Carbon::parse($data['value']);
        }

        return new self(
            name: $data['name'],
            egn: $data['egn'],
            value: $data['value'],
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
            description: $data['description'] ?? null,
        );
    }

    public static function fromRequest(Request $request): self
    {
        $value = $request->input('value');

        if (is_string($request->input('value'))) {
            $value = Carbon::parse($request->input('value'));
        }

        return new self(
            name: $request->input('name'),
            egn: $request->input('egn'),
            value: $value,
            email: $request->input('email'),
            phone: $request->input('phone'),
            description: $request->input('description'),
        );
    }

}
