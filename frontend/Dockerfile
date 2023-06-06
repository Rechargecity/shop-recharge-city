FROM node:alpine AS builder
ARG env
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN echo "REACT_APP_ENV=$env" > .env
RUN yarn build

FROM nginx:alpine AS server
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/build /usr/share/nginx/html

EXPOSE 80
