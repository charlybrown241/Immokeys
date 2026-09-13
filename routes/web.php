<?php

use App\Http\Controllers\Admin\CertificationController as AdminCertificationController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicAnnonceController;
use App\Http\Controllers\SubscriptionController;
use App\Models\Certification;
use Illuminate\Foundation\Application;
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

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:proprietaire'])
    ->name('dashboard');

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard', [
        'pendingCertificationsCount' => Certification::where('status', 'en_attente')->count(),
    ]);
})->middleware(['auth', 'verified', 'role:admin'])->name('admin.dashboard');

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/certifications', [AdminCertificationController::class, 'index'])->name('certifications.index');
    Route::get('/certifications/{certification}/document', [AdminCertificationController::class, 'document'])->name('certifications.document');
    Route::post('/certifications/{certification}/approve', [AdminCertificationController::class, 'approve'])->name('certifications.approve');
    Route::post('/certifications/{certification}/reject', [AdminCertificationController::class, 'reject'])->name('certifications.reject');
});

Route::get('/annonces', [PublicAnnonceController::class, 'index'])->name('annonces.index');
Route::get('/annonces/{annonce}', [PublicAnnonceController::class, 'show'])
    ->whereNumber('annonce')
    ->name('annonces.show');

Route::get('/annonces/{annonce}/contact-whatsapp', [PublicAnnonceController::class, 'contactWhatsapp'])
    ->whereNumber('annonce')
    ->middleware(['auth', 'role:etudiant', 'signed'])
    ->name('annonces.contact-whatsapp');

Route::middleware(['auth', 'verified', 'role:proprietaire'])->group(function () {
    Route::get('/certification', [CertificationController::class, 'create'])->name('certification.create');
    Route::post('/certification', [CertificationController::class, 'store'])->name('certification.store');

    Route::get('/mes-annonces', [AnnonceController::class, 'index'])->name('annonces.mine');
    Route::get('/annonces/create', [AnnonceController::class, 'create'])->name('annonces.create');
    Route::post('/annonces', [AnnonceController::class, 'store'])->name('annonces.store');
    Route::get('/annonces/{annonce}/edit', [AnnonceController::class, 'edit'])->name('annonces.edit');
    Route::put('/annonces/{annonce}', [AnnonceController::class, 'update'])->name('annonces.update');
    Route::delete('/annonces/{annonce}', [AnnonceController::class, 'destroy'])->name('annonces.destroy');
});

Route::middleware(['auth', 'verified', 'role:etudiant,proprietaire'])->group(function () {
    Route::get('/abonnement', [SubscriptionController::class, 'show'])->name('subscription.show');
    Route::post('/abonnement/upgrade', [SubscriptionController::class, 'upgradeToPremium'])->name('subscription.upgrade');
    Route::post('/abonnement/renew', [SubscriptionController::class, 'renewPro'])->name('subscription.renew');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
