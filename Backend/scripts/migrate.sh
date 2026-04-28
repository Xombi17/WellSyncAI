#!/bin/bash
# Script to run migrations against the configured DATABASE_URL

set -e

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

echo "Running migrations against: ${DATABASE_URL:-None}"

# Check if we are in the Backend directory or parent
if [ -f "alembic.ini" ]; then
    ALEMBIC_PATH="alembic"
else
    cd Backend
    ALEMBIC_PATH="alembic"
fi

# Run migrations
alembic upgrade head

echo "Migrations completed successfully!"
