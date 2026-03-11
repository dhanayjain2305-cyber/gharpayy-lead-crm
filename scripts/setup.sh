#!/bin/bash

echo "🚀 Setting up Gharpayy Lead Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local.example frontend/.env.local
fi

# Setup database
echo "🗄️  Setting up database..."
cd backend

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📊 Pushing database schema..."
npx prisma db push

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update backend/.env with your PostgreSQL credentials"
echo "2. Run 'npm run dev' to start the development servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, check the README.md file"
