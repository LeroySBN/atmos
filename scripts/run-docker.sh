#!/bin/bash

# Script to simplify Docker Compose commands for the Atmos project
# Usage: ./run-docker.sh [start|stop|restart|logs|command]

# Set the docker-compose file path
DOCKER_COMPOSE_FILE="docker/docker-compose.yml"

# Check if a command was provided
if [ $# -eq 0 ]; then
  echo "Usage: ./run-docker.sh [start|stop|restart|logs|command]"
  echo "Examples:"
  echo "  ./run-docker.sh start    - Start all containers"
  echo "  ./run-docker.sh stop     - Stop all containers"
  echo "  ./run-docker.sh restart  - Restart all containers"
  echo "  ./run-docker.sh logs     - View logs from all containers"
  echo "  ./run-docker.sh [command] - Run any docker-compose command"
  exit 1
fi

# Process the command
case "$1" in
  start)
    echo "Starting Atmos containers..."
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    echo "Containers started. Frontend: http://localhost:3000, API: http://localhost:8080"
    ;;
  stop)
    echo "Stopping Atmos containers..."
    docker compose -f "$DOCKER_COMPOSE_FILE" down
    echo "Containers stopped."
    ;;
  restart)
    echo "Restarting Atmos containers..."
    docker compose -f "$DOCKER_COMPOSE_FILE" down
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    echo "Containers restarted. Frontend: http://localhost:3000, API: http://localhost:8080"
    ;;
  logs)
    echo "Showing logs from all containers..."
    docker compose -f "$DOCKER_COMPOSE_FILE" logs -f
    ;;
  *)
    # Run Docker Compose with the correct configuration and pass all arguments
    docker compose -f "$DOCKER_COMPOSE_FILE" "$@"
    ;;
esac
