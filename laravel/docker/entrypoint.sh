#!/bin/sh

# Optimitzacions de Laravel per a producció
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Executar migracions de la base de dades
php artisan migrate --force

# Arrencar PHP-FPM en segon pla
php-fpm -D

# Arrencar Nginx en primer pla
nginx -g "daemon off;"