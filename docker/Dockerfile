FROM nginx:1.25.2
COPY dist/ /var/www/lime
COPY docker/nginx/default.conf /etc/nginx/conf.d/
COPY docker/nginx/cors.conf docker/nginx/.htpasswd /etc/nginx/
