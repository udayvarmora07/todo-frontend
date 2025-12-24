FROM node:22.17.0-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline && npm cache clean --force
COPY . .

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create nginx directories
RUN mkdir -p /usr/share/nginx/todo-app \
    /var/cache/nginx \
    /var/log/nginx \
    && touch /var/run/nginx.pid

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8080

# Health check - increased start-period to allow for build time
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
