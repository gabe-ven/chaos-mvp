#!/bin/bash

echo "🚀 Setting up Browser Use Service..."
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✓ Python version: $PYTHON_VERSION"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Chromium for Browser Use
echo "🌐 Installing Chromium browser..."
python -m browser_use install

# Copy env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Browser Use API key"
    echo "   Get $10 free at: https://browser-use.com"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the service:"
echo "  1. Edit .env and add your API key"
echo "  2. Run: source venv/bin/activate"
echo "  3. Run: python browser_service.py"
echo ""

