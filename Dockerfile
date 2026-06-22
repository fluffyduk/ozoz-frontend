FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint/10-generate-env.sh /docker-entrypoint.d/10-generate-env.sh
RUN chmod +x /docker-entrypoint.d/10-generate-env.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
