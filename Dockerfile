FROM node:12.16-alpine3.9 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM build AS test
RUN yarn test

FROM build as static
RUN yarn build

FROM nginx:stable-alpine AS production
COPY --from=static /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
