<?php

use App\Exceptions\AppException;
use App\Exceptions\ApiException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        // $middleware->api(prepend: [\App\Http\Middleware\DevAutoLogin::class]);
        $middleware->redirectGuestsTo(fn(Request $request): ?string => $request->is('api/*')
            ? null
            : route('login'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });
        $exceptions->render(function (AppException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => $e->getMessage()], $e->status());
            }
        });
        $exceptions->render(function (ApiException $e, Request $request) {
            if ($request->is('api/*')) {
                return $e->render();
            }
        });

        // 3. Unauthenticated requests (401)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new ApiException(
                    message: 'Unauthenticated user.',
                    errorCode: 'UNAUTHENTICATED',
                    status: 401,
                    previous: $e
                ))->render();
            }
        });

        // 4. Endpoint or Resource Not Found (404)
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new ApiException(
                    message: 'The requested endpoint or resource was not found.',
                    errorCode: 'ENDPOINT_NOT_FOUND',
                    status: 404,
                    previous: $e
                ))->render();
            }
        });

        // 5. HTTP Method Not Allowed / Method Not Supported (405)
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new ApiException(
                    message: 'HTTP method not supported for this endpoint.',
                    errorCode: 'METHOD_NOT_ALLOWED',
                    status: 405,
                    previous: $e
                ))->render();
            }
        });
    })->create();
