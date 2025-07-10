#!/bin/bash
# Script to start Next.js in standalone mode

# Build the application first
echo "Building Next.js application..."
npm run build

# Start the standalone server
echo "Starting standalone server..."
node .next/standalone/server.js
