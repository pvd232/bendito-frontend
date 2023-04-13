# Build environment
# Static React app
FROM node:19.9.0-alpine3.16 as react-build
WORKDIR /app
RUN mkdir -p /app/frontend-react-app
ADD /frontend-react-app ./frontend-react-app
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
WORKDIR /app/frontend-react-app
RUN yarn install --production
# Build the app
RUN yarn run build

# Server environment
FROM ghcr.io/zvonimirsun/nginx:stable-alpine-brotli
COPY nginx.conf /etc/nginx/conf.d/configfile.template


COPY --from=react-build /app/build /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
