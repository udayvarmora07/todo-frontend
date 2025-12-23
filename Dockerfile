# =============================================================================
# Stage 1: Dependencies (Cached unless package.json changes)
# =============================================================================
FROM node:22.17.0-slim AS deps

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy ONLY package files first (this layer is cached if dependencies don't change)
COPY package.json package-lock.json ./

# Install dependencies (cached if package.json unchanged)
RUN npm ci --prefer-offline && npm cache clean --force

# =============================================================================
# Stage 2: Build Application
# =============================================================================
FROM node:22.17.0-slim AS builder

WORKDIR /app

# Copy node_modules from deps stage (cached)
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./

# Build arguments - declared BEFORE COPY to avoid cache invalidation
ARG VITE_API_URL
ARG NODE_ENV=production

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL} \
    NODE_ENV=${NODE_ENV}

# Copy source code AFTER ARGs (this always invalidates on code change - expected)
COPY . .

# Build application
RUN npm run build && \
    find ./dist -name "*.map" -type f -delete 2>/dev/null || true

# =============================================================================
# Stage 3: Production Runtime (Nginx Alpine)
# =============================================================================
FROM nginx:1.27-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create app directory
RUN mkdir -p /usr/share/nginx/todo-app

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/todo-app

# Create non-root user and set permissions in one layer
RUN addgroup -g 1000 appuser && \
    adduser -u 1000 -G appuser -D -H -s /sbin/nologin appuser && \
    chown -R appuser:appuser /usr/share/nginx/todo-app \
                              /var/cache/nginx \
                              /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown appuser:appuser /var/run/nginx.pid && \
    nginx -t

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
