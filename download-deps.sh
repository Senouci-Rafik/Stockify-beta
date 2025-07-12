#!/bin/bash

# Create necessary directories
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/lib

# Download package.json dependencies
echo "Downloading package.json dependencies..."
curl -o package.json https://raw.githubusercontent.com/friendly-interface-kit/main/package.json

# Download tsconfig files
echo "Downloading TypeScript configuration..."
curl -o tsconfig.json https://raw.githubusercontent.com/friendly-interface-kit/main/tsconfig.json
curl -o tsconfig.app.json https://raw.githubusercontent.com/friendly-interface-kit/main/tsconfig.app.json

# Download source files
echo "Downloading source files..."

# UI Components
curl -o src/components/ui/toast.tsx https://raw.githubusercontent.com/friendly-interface-kit/main/src/components/ui/toast.tsx
curl -o src/components/ui/toaster.tsx https://raw.githubusercontent.com/friendly-interface-kit/main/src/components/ui/toaster.tsx

# Hooks
curl -o src/hooks/use-toast.ts https://raw.githubusercontent.com/friendly-interface-kit/main/src/hooks/use-toast.ts

# Utils
curl -o src/lib/utils.ts https://raw.githubusercontent.com/friendly-interface-kit/main/src/lib/utils.ts

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Download complete!" 