FROM php:8.2-fpm-alpine

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
COPY . /var/www/html

# Configuració de permisos de Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Instal·lar dependències de Laravel sense dependències de dev
RUN composer install --no-dev --optimize-autoloader

# Configuració de Nginx
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# Script d'entrada per a Render
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]