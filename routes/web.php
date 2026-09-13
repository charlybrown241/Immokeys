<?php

use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Request $request) {
    return Inertia::render('Dashboard', [
        'certification' => $request->user()->certification,
    ]);
})->middleware(['auth', 'verified', 'role:proprietaire'])->name('dashboard');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified', 'role:admin'])->name('admin.dashboard');

Route::get('/annonces', function () {
    return Inertia::render('Annonces/Index');
})->name('annonces.index');

Route::middleware(['auth', 'verified', 'role:proprietaire'])->group(function () {
    Route::get('/certification', [CertificationController::class, 'create'])->name('certification.create');
    Route::post('/certification', [CertificationController::class, 'store'])->name('certification.store');
    Route::get('/annonces/create', [AnnonceController::class, 'create'])->name('annonces.create');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
