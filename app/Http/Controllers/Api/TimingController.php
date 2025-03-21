<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTimingRequest;
use App\Http\Resources\TimingResource;
use App\Http\Requests\UpdateTimingRequest;
use App\Services\Timing;
use App\Dto\Timing as Dto;

class TimingController extends Controller
{
    public function __construct(protected Timing $timing)
    {
    }

    public function index()
    {
        return TimingResource::collection($this->timing->getAll());
    }

    public function store(StoreTimingRequest $request)
    {
        $dto = Dto::fromArray($request->validated());
        $timing = $this->timing->create($dto);

        return (new TimingResource($timing));
    }

    public function update(UpdateTimingRequest $request, $id)
    {
        $dto = Dto::fromArray($request->validated());
        $timing = $this->timing->update($id, $dto);

        return (new TimingResource($timing));
    }

    public function destroy($id)
    {
        $deleted = $this->timing->delete($id);

        if (!$deleted) {
            response()->json([
                'status' => true,
                'message' => 'Something was wrong'
            ], 500);
        }

        return response()->json([
            'status' => true,
            'message' => 'Timing deleted successfully'
        ], 204);
    }
}
