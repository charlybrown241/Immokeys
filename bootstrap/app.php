<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        // The "guest" middleware (RedirectIfAuthenticated) hardcodes a
        // redirect to route('dashboard') by default, which 403s for
        // etudiant/admin users since that route is proprietaire-only.
        // Reuse the same per-role home route as post-login/registration.
        $middleware->redirectUsersTo(
            fn ($request) => route($request->user()->homeRouteName())
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
