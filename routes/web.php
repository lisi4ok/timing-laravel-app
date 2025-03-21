<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TimingController;
use App\Http\Controllers\AppointmentController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/', AppointmentController::class)->name('appointment');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('timing', TimingController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
