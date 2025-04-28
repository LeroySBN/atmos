# Atmos

A decoupled weather application with a NextJS frontend and Laravel API backend. This application fetches weather data from OpenWeatherMap API.

## Tech Stack

### Frontend
- NextJS
- TypeScript
- RippleUI components from Tailwind CSS

### Backend
- Laravel (latest version)
- PHP 8.3

## Project Structure

- `/api` - Laravel backend API
- `/webApp` - NextJS frontend application
- `/docker` - Docker configuration files

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- OpenWeatherMap API key (get one from [OpenWeatherMap](https://openweathermap.org/api))

### Environment Configuration

1. Create a `.env` file in the `/docker` directory with the following content:

```
APP_KEY="base64:DKO+AE1ALdJvq5MoQRXBf9HpbIGb5qWAP0qvW5kk160="
OPENWEATHER_API_KEY="your_openweathermap_api_key_here"
```

2. Replace `your_openweathermap_api_key_here` with your actual OpenWeatherMap API key.

### Running the Application

#### Using the Convenience Script

A convenience script is provided to simplify Docker commands:

```bash
# Make the script executable (first time only)
chmod +x run-docker.sh

# Start the containers
./run-docker.sh up -d

# Stop the containers
./run-docker.sh down

# View container logs
./run-docker.sh logs

# Restart containers
./run-docker.sh restart
```

#### Manual Commands

Alternatively, you can use the full Docker Compose commands:

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d
```

#### Testing the API

Once the application is running, the Laravel API will be available at: http://localhost:8080/api

Test the API with:

```bash
curl "http://localhost:8080/api/health"  # Check API health
curl "http://localhost:8080/api/weather?city=London"  # Get weather for London
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/weather?city={city}` - Get weather data for a specific city
  - Optional query parameter: `units` (metric, imperial) - Default: metric

## Development

### Backend (Laravel)

The Laravel backend uses the OpenWeatherMap API to fetch weather data. The main components are:

- `WeatherController` - Handles the API requests and responses
- Environment variables for API keys and configuration

### Frontend (NextJS)

The frontend is a NextJS application that consumes the Laravel API. It uses RippleUI components from Tailwind CSS for the UI.
