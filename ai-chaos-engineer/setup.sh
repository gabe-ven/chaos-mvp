#!/bin/bash

echo "🔥 AI Chaos Engineer - Setup Script"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the ai-chaos-engineer directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend install failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend install failed"
    exit 1
fi

echo "📦 Installing additional frontend dependencies..."
npm install react-router-dom@^6.20.1 framer-motion@^10.16.16
if [ $? -ne 0 ]; then
    echo "❌ Additional frontend dependencies failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

cd ..

echo "📝 Checking environment setup..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found in backend/"
    echo "Creating from template..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env from template"
        echo "⚠️  Please add your API keys to backend/.env"
    else
        echo "❌ No .env.example found"
    fi
else
    echo "✅ .env file exists"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""

