<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

Route::get('/weather', [WeatherController::class, 'getWeather']);

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/env-test', function () {
    return response()->json([
        'api_key_length' => strlen(env('OPENWEATHER_API_KEY')),
        'api_key_start' => substr(env('OPENWEATHER_API_KEY'), 0, 5),
        'api_key_end' => substr(env('OPENWEATHER_API_KEY'), -5),
    ]);
});
