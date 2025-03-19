<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
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
        return Inertia::render('timing/index', [
            'timings' => $this->timing->getAll(),
        ]);
    }

    public function create()
    {
        return Inertia::render('timing/create');
    }

    public function store(StoreTimingRequest $request): RedirectResponse
    {
        $dto = Dto::fromArray($request->validated());
        $this->timing->create($dto);

        return to_route('timing.index');
    }

    public function show($id)
    {
        return Inertia::render('timing/show', [
            'timing' => $this->timing->getById($id),
        ]);
    }

    public function edit($id)
    {
        return Inertia::render('timing/edit', [
            'timing' => $this->timing->getById($id),
        ]);
    }

    public function update(UpdateTimingRequest $request, $id): RedirectResponse
    {
        $dto = Dto::fromArray($request->validated());

        $this->timing->update($id, $dto);

        return redirect()->route('timing.index')
            ->with('success', 'Timing updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $deleted = $this->timing->delete($id);

        if (!$deleted) {
            return redirect()->back()->withErrors('Timing not found.');
        }

        return redirect()->route('timing.index')
            ->with('success', 'Timing deleted successfully.');
    }
}
