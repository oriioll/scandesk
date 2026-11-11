#!/bin/sh

mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Netejar i tornar a generar les mètries de cache de Laravel
php artisan config:clear
php artisan view:clear
php artisan cache:clear
php artisan view:cache

# Iniciar el servei principal (supervisor / nginx / php-fpm)
exec "$@"