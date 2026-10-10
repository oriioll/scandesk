#!/bin/bash
## Starts all services in dev mode

BASE_DIR="$(dirname "$0")/.."

echo "Starting Angular..."
(cd "$BASE_DIR/angular" && ng serve) &

echo "Starting Node..."
(cd "$BASE_DIR/node" && npm run dev) &

echo "Starting Laravel..."
(cd "$BASE_DIR/laravel" && php artisan serve) &

echo "All started up!"
wait
