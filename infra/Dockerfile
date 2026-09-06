FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run lint && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S daily && adduser -S daily -G daily && apk add --no-cache wget
COPY --from=build --chown=daily:daily /app/dist ./dist
COPY --from=build --chown=daily:daily /app/package*.json ./
USER daily
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["node", "dist/server.js"]
