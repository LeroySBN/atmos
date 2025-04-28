<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Carbon;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city');
        $units = $request->query('units', 'metric');
        // Get API key from environment
        $apiKey = env('OPENWEATHER_API_KEY');

        if (!$city) {
            return response()->json(['error' => 'City is required'], 400);
        }

        // Step 1: Use standard weather API to get city coordinates
        $cityUrl = "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid={$apiKey}";
        $cityResponse = Http::get($cityUrl);

        if ($cityResponse->failed()) {
            return response()->json([
                'error' => 'City lookup failed', 
                'status' => $cityResponse->status(),
                'details' => $cityResponse->json() ?: $cityResponse->body(),
                'request_url' => "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid=[hidden]"
            ], 500);
        }

        $cityData = $cityResponse->json();

        if (empty($cityData) || !isset($cityData['coord']['lat']) || !isset($cityData['coord']['lon'])) {
            return response()->json([
                'error' => 'Could not find coordinates for city',
                'city' => $city
            ], 404);
        }

        // Extract coordinates and location information
        $lat = $cityData['coord']['lat'];
        $lon = $cityData['coord']['lon'];
        $location = $cityData['name'] . (isset($cityData['sys']['country']) ? ', ' . $cityData['sys']['country'] : '');

        // Step 2: Use weather API with coordinates and units to get weather data
        $weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&units={$units}&appid={$apiKey}";
        $weatherResponse = Http::get($weatherUrl);
        
        if ($weatherResponse->failed()) {
            return response()->json([
                'error' => 'Weather data lookup failed', 
                'status' => $weatherResponse->status(),
                'details' => $weatherResponse->json() ?: $weatherResponse->body(),
                'request_url' => "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&units={$units}&appid=[hidden]"
            ], 500);
        }
        
        $weather = $weatherResponse->json();
        
        // Format the response
        return response()->json([
            'location' => $location,
            'date' => Carbon::now()->toDateString(),
            'current' => [
                'icon' => $weather['weather'][0]['icon'] ?? null,
                'temp' => $weather['main']['temp'] ?? null,
                'feels_like' => $weather['main']['feels_like'] ?? null,
                'description' => $weather['weather'][0]['description'] ?? null,
                'wind' => [
                    'speed' => $weather['wind']['speed'] ?? null,
                    'deg' => $weather['wind']['deg'] ?? null,
                ],
                'humidity' => $weather['main']['humidity'] ?? null,
                'visibility' => $weather['visibility'] ?? null,
                'pressure' => $weather['main']['pressure'] ?? null,
            ]
        ]);
    }
}
