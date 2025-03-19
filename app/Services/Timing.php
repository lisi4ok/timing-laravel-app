<?php

namespace App\Services;

use App\Models\Timing as Model;
use App\Dto\Timing as Dto;
use Illuminate\Database\Eloquent\Collection;

class Timing
{
    public function getAll(): Collection
    {
        return Model::all();
    }

    public function create(Dto $dto): Model
    {
        return Model::create([
            'name'  => $dto->name,
            'egn'   => $dto->egn,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'value' => $dto->value,
        ]);
    }

    public function getById(int $id): Model
    {
        return Model::findOrFail($id);
    }

    public function update(int $id, Dto $dto): Model
    {
        $timing = Model::findOrFail($id);

        $timing->update([
            'name'  => $dto->name,
            'egn'   => $dto->egn,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'value' => $dto->value->format(config('app.datetime_format')),
        ]);

        return $timing;
    }

    public function delete(int $id): bool
    {
        return Model::findOrFail($id)->delete();
    }

    public function convertToDto(Model $timing): Dto
    {
        return new Dto(
            name: $timing->name,
            egn: $timing->egn,
            email: $timing->email,
            phone: $timing->phone,
            description: $timing->description,
            value: $timing->value,
        );
    }
}
