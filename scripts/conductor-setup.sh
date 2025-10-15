#!/bin/bash
set -e

echo "🚀 Setting up Cloud Posse Documentation workspace..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js v20.10 or later from https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="20.10"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Error: Node.js version $NODE_VERSION is too old"
    echo "Required: Node.js v$REQUIRED_VERSION or later"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"

# Clear any cached build artifacts
echo "🧹 Clearing cached build artifacts..."
rm -rf .docusaurus build 2>/dev/null || true

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

echo "✅ Setup complete! You can now click 'Run' to start the development server."
