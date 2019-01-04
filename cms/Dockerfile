FROM wordpress:cli

# Environment variables
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_NAME=wordpress
ENV DB_USER=root
ENV DB_PASS=password

ENV SITE_URL=localhost:8080
ENV SITE_TITLE=WordpressQL

ENV ADMIN_USER=username
ENV ADMIN_PASSWORD=password
ENV ADMIN_EMAIL=user@example.com

# Install dockerize (https://github.com/jwilder/dockerize)
USER root
ARG DOCKERIZE_RELEASE=v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz
RUN curl -sL https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_RELEASE} \
  | tar -C /usr/bin -xzvf -
USER www-data

# Copy theme for ACF Sync
COPY ./themes /themes
COPY ./dist/acf-json /themes/headless-theme/acf-json

# Copy CPTUI exports
COPY dist/post_types.json /post_types.json
COPY dist/taxonomies.json /taxonomies.json

# Create wp-config
CMD ( \
# Download latest wordpress
wp core download \
--version=4.9.9 \
--skip-content  \
# Create wp-config
&& wp config create \
--dbhost=$DB_HOST \
--dbname=$DB_NAME \
--dbuser=$DB_USER \
--dbpass=$DB_PASS \
--skip-check \
# Wait for mySQL to be ready
&& dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 30s \
&& wp db create \
# Install Wordpress
&& wp core install \
--url=$SITE_URL \
--title=$SITE_TITLE \
--admin_user=$ADMIN_USER \
--admin_password=$ADMIN_PASSWORD \
--admin_email=$ADMIN_EMAIL \
--skip-email \
# Install plugins
&& wp plugin install custom-post-type-ui --version=1.6.1 --activate \
&& wp plugin install advanced-custom-fields --version=5.7.7 --activate \
# Copy over themes
&& cp -r /themes /var/www/html/wp-content/themes \
&& wp theme activate headless-theme \
# Import CPTUI post types and taxonomies
&& (wp cptui import --type=post_type --data-path=/post_types.json || true) \
&& (wp cptui import --type=taxonomy --data-path=/taxonomies.json || true) \
# Wipe out default posts
&& wp site empty --yes \
# Disable admin user
&& wp user set-role 1 editor \
# Skip all that if any step fails (Wordpress is already installed)
|| true) \
# Start web server
&& wp server --host=0.0.0.0
