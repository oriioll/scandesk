FROM php:8.4-fpm-alpine

# Instal·lar dependències del sistema i extensions de PHP per a Laravel
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    postgresql-dev \
    oniguruma-dev

RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Instal·lar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar el codi del projecte
COPY . .

# 1. Crear l'estructura de carpetes ABANS de fer res de Laravel/Composer
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# 2. Assignar permisos a les carpetes acabades de crear
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 3. Instal·lar dependències amb --no-scripts per evitar que package:discover peti sense base de dades/env
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# 4. Ara sí, generar l'autoload i el package discovery amb l'estructura ja a lloc
RUN composer dump-autoload --optimize --no-dev

# Configuració de Nginx i Entrypoint
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV VIEW_COMPILED_PATH=/var/www/html/storage/framework/views

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]