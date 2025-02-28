FROM node:lts-buster-slim AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

FROM build as static
RUN yarn build

FROM nginx:stable-alpine AS production
COPY --from=static /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
