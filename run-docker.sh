#!/bin/bash

# Script to simplify Docker Compose commands for the Atmos project
# Usage: ./run-docker.sh [command]
# Example: ./run-docker.sh up -d

# Check if a command was provided
if [ $# -eq 0 ]; then
  echo "Usage: ./run-docker.sh [command]"
  echo "Example: ./run-docker.sh up -d"
  exit 1
fi

# Run Docker Compose with the correct configuration
docker compose -f docker/docker-compose.yml --env-file docker/.env "$@"
