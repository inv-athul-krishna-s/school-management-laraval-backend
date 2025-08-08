<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
       $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class, 
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle 404 Not Found for API routes
        $exceptions->renderable(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Not Found'], 404);
            }
        });
        //Handle Authentication exceptions (Laravel guard failures)
        $exceptions->renderable(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
        });
        // Handle Authorization exceptions (e.g., role-based access control)
        $exceptions->renderable(function (UnauthorizedHttpException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthorized - Invalid or expired token'], 401);
            }
        });
        // Handle Token Expired exceptions
        $exceptions->renderable(function (TokenExpiredException $e, $request) {
            return response()->json(['message' => 'Token has expired'], 401);
        });
        // Handle Token Invalid exceptions
        $exceptions->renderable(function (TokenInvalidException $e, $request) {
            return response()->json(['message' => 'Token is invalid'], 401);
        });
        // Handle Token Not Provided exceptions
        $exceptions->renderable(function (JWTException $e, $request) {
            return response()->json(['message' => 'Token not provided'], 401);
        });
    })->create();
