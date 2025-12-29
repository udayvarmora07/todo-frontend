#!/bin/bash
set -eo pipefail

# Trap signals for graceful shutdown
trap 'echo "Received SIGTERM, shutting down..."; kill -TERM $PID 2>/dev/null; wait $PID' TERM INT

START_TIME=$(date +%s)

echo "=============================================="
echo "🚀 Todo Frontend - Runtime Build"
echo "=============================================="
echo "Build started at: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo ""

# Step 1: Create .env from runtime environment variables
echo "📝 Step 1: Creating .env from environment variables..."

ENV_FILE="/app/.env"
> "$ENV_FILE"

VITE_VARS=$(env | grep "^VITE_" || true)

if [ -z "$VITE_VARS" ]; then
    echo "   ⚠️  No VITE_* environment variables found!"
    echo "   💡 Tip: Set VITE_API_URL and other VITE_* vars in App Runner"
else
    echo "$VITE_VARS" | while IFS= read -r line; do
        if [ -n "$line" ]; then
            echo "$line" >> "$ENV_FILE"
            VAR_NAME=$(echo "$line" | cut -d'=' -f1)
            echo "   ✅ $VAR_NAME"
        fi
    done
fi

echo ""

# Step 2: Build the application
echo "🔨 Step 2: Building application with Vite..."
echo ""

npm run build

# Remove source maps for security
find ./dist -name "*.map" -type f -delete 2>/dev/null || true

BUILD_TIME=$(date +%s)
BUILD_DURATION=$((BUILD_TIME - START_TIME))

echo ""
echo "   ✅ Build completed in ${BUILD_DURATION}s"
echo ""

# Step 3: Copy build output to nginx directory
echo "📦 Step 3: Deploying to nginx..."

rm -rf /usr/share/nginx/todo-app/*
cp -r /app/dist/* /usr/share/nginx/todo-app/

# Count files deployed
FILE_COUNT=$(find /usr/share/nginx/todo-app -type f | wc -l)
TOTAL_SIZE=$(du -sh /usr/share/nginx/todo-app | cut -f1)

echo "   ✅ Deployed ${FILE_COUNT} files (${TOTAL_SIZE})"
echo ""

# Step 4: Start nginx
TOTAL_TIME=$(($(date +%s) - START_TIME))

echo "=============================================="
echo "✅ Ready! Startup completed in ${TOTAL_TIME}s"
echo "=============================================="
echo ""
echo "📊 Startup metrics:"
echo "   - Build time: ${BUILD_DURATION}s"
echo "   - Files deployed: ${FILE_COUNT}"
echo "   - Total size: ${TOTAL_SIZE}"
echo ""

# Start nginx and capture PID
nginx -g "daemon off;" &
PID=$!

# Wait for nginx process
wait $PID
