#!/bin/bash

# AI Chaos Engineer - Setup Verification Script
# This script verifies that everything is properly set up

echo "🔥 AI Chaos Engineer - Setup Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_GOOD=true

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ALL_GOOD=false
    fi
}

# 1. Check Node.js
echo "📦 Checking Prerequisites..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js installed ($NODE_VERSION)"
else
    print_status 1 "Node.js not found - please install Node.js 18+"
fi

# 2. Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm installed ($NPM_VERSION)"
else
    print_status 1 "npm not found"
fi

echo ""

# 3. Check backend dependencies
echo "🔧 Checking Backend..."
if [ -d "ai-chaos-engineer/backend/node_modules" ]; then
    print_status 0 "Backend dependencies installed"
else
    print_status 1 "Backend dependencies missing - run: cd ai-chaos-engineer/backend && npm install"
fi

# 4. Check backend files
BACKEND_FILES=(
    "ai-chaos-engineer/backend/src/index.js"
    "ai-chaos-engineer/backend/src/chaosTests.js"
    "ai-chaos-engineer/backend/src/aiAnalyzer.js"
    "ai-chaos-engineer/backend/src/sentry.js"
    "ai-chaos-engineer/backend/src/reportBuilder.js"
    "ai-chaos-engineer/backend/src/daytonaClient.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename $file) exists"
    else
        print_status 1 "$(basename $file) missing"
    fi
done

echo ""

# 5. Check frontend dependencies
echo "🎨 Checking Frontend..."
if [ -d "ai-chaos-engineer/frontend/node_modules" ]; then
    print_status 0 "Frontend dependencies installed"
else
    print_status 1 "Frontend dependencies missing - run: cd ai-chaos-engineer/frontend && npm install"
fi

# 6. Check frontend files
FRONTEND_FILES=(
    "ai-chaos-engineer/frontend/src/App.jsx"
    "ai-chaos-engineer/frontend/src/components/RunForm.jsx"
    "ai-chaos-engineer/frontend/src/components/ReportView.jsx"
    "ai-chaos-engineer/frontend/src/lib/api.js"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename $file) exists"
    else
        print_status 1 "$(basename $file) missing"
    fi
done

echo ""

# 7. Check .env file
echo "⚙️  Checking Configuration..."
if [ -f "ai-chaos-engineer/backend/.env" ]; then
    print_status 0 ".env file exists"
    
    # Check for API keys (optional)
    if grep -q "OPENAI_API_KEY=sk-" "ai-chaos-engineer/backend/.env" 2>/dev/null; then
        echo -e "${GREEN}  ℹ${NC}  OpenAI API key configured"
    elif grep -q "ANTHROPIC_API_KEY=sk-" "ai-chaos-engineer/backend/.env" 2>/dev/null; then
        echo -e "${GREEN}  ℹ${NC}  Anthropic API key configured"
    else
        echo -e "${YELLOW}  ℹ${NC}  No AI API key configured (will use fallback)"
    fi
    
    if grep -q "SENTRY_DSN=https://" "ai-chaos-engineer/backend/.env" 2>/dev/null; then
        echo -e "${GREEN}  ℹ${NC}  Sentry DSN configured"
    else
        echo -e "${YELLOW}  ℹ${NC}  No Sentry DSN configured (will log to console)"
    fi
else
    echo -e "${YELLOW}  ℹ${NC}  No .env file (optional - app works without it)"
fi

echo ""

# 8. Check documentation
echo "📚 Checking Documentation..."
DOC_FILES=(
    "README.md"
    "HACKATHON_README.md"
    "ai-chaos-engineer/QUICKSTART.md"
    "ai-chaos-engineer/TEST_CHECKLIST.md"
    "ai-chaos-engineer/SUMMARY.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$(basename $file) exists"
    else
        print_status 1 "$(basename $file) missing"
    fi
done

echo ""

# 9. Port availability check
echo "🔌 Checking Port Availability..."
if command_exists lsof; then
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status 1 "Port 3001 is in use (backend won't start)"
        echo -e "   ${YELLOW}→${NC} Run: lsof -ti:3001 | xargs kill"
    else
        print_status 0 "Port 3001 is available (backend)"
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status 1 "Port 5173 is in use (frontend won't start)"
        echo -e "   ${YELLOW}→${NC} Run: lsof -ti:5173 | xargs kill"
    else
        print_status 0 "Port 5173 is available (frontend)"
    fi
else
    echo -e "${YELLOW}  ℹ${NC}  Cannot check ports (lsof not available)"
fi

echo ""

# 10. Summary
echo "=========================================="
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "🚀 Ready to run:"
    echo ""
    echo "Terminal 1:"
    echo "  cd ai-chaos-engineer/backend && npm run dev"
    echo ""
    echo "Terminal 2:"
    echo "  cd ai-chaos-engineer/frontend && npm run dev"
    echo ""
    echo "Then open: http://localhost:5173"
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Please fix the issues above and try again."
fi

echo ""

