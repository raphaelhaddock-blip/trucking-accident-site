#!/bin/bash
set -e

echo "=== CLAUDE CODE INIT ==="
echo "Project: 18-Wheeler Accident Site"
echo "Timestamp: $(date)"
echo ""

# Kill any existing processes on port 3006
echo ">> Checking for processes on port 3006..."
if lsof -ti:3006 > /dev/null 2>&1; then
    echo "   Killing existing process on port 3006..."
    lsof -ti:3006 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Check node_modules
echo ">> Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   node_modules exists"
fi

# Check for .env.local (will need Sanity credentials later)
echo ">> Checking environment..."
if [ -f ".env.local" ]; then
    echo "   .env.local exists"
else
    echo "   WARNING: .env.local not found (may need Sanity credentials later)"
fi

# Clean .next cache if corrupt
echo ">> Checking .next cache..."
if [ -d ".next" ]; then
    # Check if .next is valid
    if [ ! -f ".next/BUILD_ID" ] && [ -d ".next" ]; then
        echo "   Clearing potentially corrupt .next cache..."
        rm -rf .next
    else
        echo "   .next cache exists"
    fi
fi

# Start dev server in background
echo ">> Starting development server on port 3005..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to be ready
echo ">> Waiting for server to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:3006 > /dev/null 2>&1; then
        echo "   Server is ready!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "   ERROR: Server failed to start within 30 seconds"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Health check
echo ">> Running health check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3006)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   Homepage returns 200 OK"
else
    echo "   WARNING: Homepage returned $HTTP_CODE"
fi

echo ""
echo "=== INIT COMPLETE ==="
echo "Dev server running at: http://localhost:3006"
echo "Process ID: $DEV_PID"
echo ""
echo "To stop server: kill $DEV_PID"
echo "Or: lsof -ti:3006 | xargs kill -9"
