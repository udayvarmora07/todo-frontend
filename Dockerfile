# ============================================================================
# Todo Frontend - Production Dockerfile
# Builds at runtime to support dynamic VITE_* environment variables
# ============================================================================

# Build Arguments
ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-slim

# Image metadata
LABEL org.opencontainers.image.title="Todo Frontend"
LABEL org.opencontainers.image.description="Todo App Frontend with runtime build for dynamic env vars"
LABEL org.opencontainers.image.source="https://github.com/udayvarmora07/todo-frontend"
LABEL org.opencontainers.image.vendor="TodoApp"

# Install system dependencies in single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    nginx \
    curl \
    tini \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy package files first (better cache utilization)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit --no-fund \
    && npm cache clean --force

# Copy application source
COPY . .

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create required directories and set permissions
RUN mkdir -p /usr/share/nginx/todo-app \
    /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Health check with appropriate timing for runtime build
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Use tini as init system for proper signal handling
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/app/docker-entrypoint.sh"]
