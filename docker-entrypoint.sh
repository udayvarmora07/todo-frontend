#!/bin/bash
set -e

echo "=============================================="
echo "🚀 Todo Frontend - Runtime Build"
echo "=============================================="
echo ""

# Step 1: Create .env from runtime environment variables
echo "📝 Step 1: Creating .env from environment variables..."

ENV_FILE="/app/.env"

# Create empty .env file
> "$ENV_FILE"

# Find all VITE_* environment variables and write to .env
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

# Run the build
npm run build

# Remove source maps for security and smaller size
find ./dist -name "*.map" -type f -delete 2>/dev/null || true

echo ""
echo "   ✅ Build completed successfully!"
echo ""

# Step 3: Copy build output to nginx directory
echo "📦 Step 3: Deploying to nginx..."

# Clear existing files
rm -rf /usr/share/nginx/todo-app/*

# Copy built files
cp -r /app/dist/* /usr/share/nginx/todo-app/

echo "   ✅ Files deployed to /usr/share/nginx/todo-app/"
echo ""

# Step 4: Start nginx
echo "=============================================="
echo "✅ Build complete! Starting nginx on port 8080"
echo "=============================================="
echo ""

# Replace current process with nginx (proper signal handling)
exec nginx -g "daemon off;"
