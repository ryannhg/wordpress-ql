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

# Create wp-config
CMD ( \
wp core download --skip-content \
&& wp config create \
--dbhost=$DB_HOST \
--dbname=$DB_NAME \
--dbuser=$DB_USER \
--dbpass=$DB_PASS \
--skip-check \
&& dockerize -wait tcp://$DB_HOST:$DB_PORT -timeout 30s \
&& wp db create \
&& wp core install \
--url=$SITE_URL \
--title=$SITE_TITLE \
--admin_user=$ADMIN_USER \
--admin_password=$ADMIN_PASSWORD \
--admin_email=$ADMIN_EMAIL \
--skip-email \
&& wp plugin install custom-post-type-ui --version=1.6.1 --activate \
&& wp plugin install advanced-custom-fields --version=5.7.7 --activate \
# && wp user set-role 1 editor \ 
|| true) \
&& wp server --host=0.0.0.0
