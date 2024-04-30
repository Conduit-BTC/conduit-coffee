FROM node:18-slim AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

# Specify any needed environment variables here
ARG VITE_API_URL

RUN npm run build

FROM caddy

WORKDIR /app

COPY Caddyfile ./

COPY --from=build ./dist /app/dist

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]
