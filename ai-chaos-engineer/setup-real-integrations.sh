#!/bin/bash

# Setup script for real integrations
# Run this to install Sentry and Puppeteer for production features

echo "🚀 AI Chaos Engineer - Real Integrations Setup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Change to backend directory
cd "$(dirname "$0")/backend" || exit 1

echo "📦 Installing real integration packages..."
echo ""

# Install Sentry
echo "Installing @sentry/node..."
npm install @sentry/node

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Sentry installed successfully"
else
    echo -e "${RED}✗${NC} Sentry installation failed"
fi

echo ""

# Install Puppeteer
echo "Installing puppeteer (this may take a few minutes - downloads Chromium)..."
npm install puppeteer

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Puppeteer installed successfully"
else
    echo -e "${RED}✗${NC} Puppeteer installation failed"
fi

echo ""
echo "=============================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo ""
    echo "Creating .env from template..."
    
    cat > .env << 'EOF'
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3001
NODE_ENV=development

# ============================================
# AI ANALYSIS - ANTHROPIC CLAUDE (PRIMARY)
# ============================================
# Get your key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# ============================================
# AI ANALYSIS - OPENAI (ALTERNATIVE)
# ============================================
# Get your key from: https://platform.openai.com/api-keys
# OPENAI_API_KEY=your_openai_key_here
# OPENAI_MODEL=gpt-4o-mini

# ============================================
# DAYTONA API (WORKSPACE PROVISIONING)
# ============================================
# Get your key from: https://www.daytona.io/
DAYTONA_API_KEY=your_daytona_key_here
DAYTONA_API_URL=https://api.daytona.io

# ============================================
# SENTRY (ERROR TRACKING)
# ============================================
# Get your DSN from: https://sentry.io/
SENTRY_DSN=your_sentry_dsn_here
EOF

    echo -e "${GREEN}✓${NC} Created .env file"
    echo ""
    echo -e "${YELLOW}📝 Please edit backend/.env and add your API keys${NC}"
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

echo ""
echo "=============================================="
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys (see REAL_INTEGRATIONS.md)"
echo "2. Run: npm run dev"
echo ""
echo "API Keys needed:"
echo "  • Claude API: https://console.anthropic.com/"
echo "  • Daytona API: https://www.daytona.io/"
echo "  • Sentry DSN: https://sentry.io/"
echo ""
echo "See backend/REAL_INTEGRATIONS.md for detailed setup guide"
echo ""

