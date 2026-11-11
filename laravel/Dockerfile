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

# Copiar el projecte
COPY . .

# 1. Instal·lar dependències primer de tot
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 2. Assegurar l'existència física de TOTA l'estructura de storage de Laravel
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# 3. Configuració explícita de permisos sobre el directori final
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Configuració de Nginx i Entrypoint
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Definir la ruta de compilació de Blade per defecte com a variable d'entorn d'emergència
ENV VIEW_COMPILED_PATH=/var/www/html/storage/framework/views

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]