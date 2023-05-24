FROM node:18 AS build-env

# Create app directory
WORKDIR /app

ENV TZ=Europe/Vienna
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install app dependencies
COPY . .
RUN  yarn install --frozen-lockfile

# If you are building your code for production
# RUN yarn build

# # Running
# FROM nginx:alpine
# COPY --from=build-env /app/dist /usr/share/nginx/html
# COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/custom.conf

# COPY ./docker/collectivo-entrypoint.sh /docker-entrypoint.d/10-collectivo-entrypoint.sh
