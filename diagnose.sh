#!/bin/bash

# Music Blog Diagnostic Script
# Run this to check your setup

echo "🔍 Music Blog Diagnostics"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: .env file
echo "1️⃣  Checking .env file..."
if [ -f .env ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check for required variables
    if grep -q "SPOTIFY_CLIENT_ID=your-spotify-client-id" .env || grep -q "SPOTIFY_CLIENT_ID=$" .env; then
        echo -e "${RED}❌ SPOTIFY_CLIENT_ID not configured${NC}"
    else
        echo -e "${GREEN}✅ SPOTIFY_CLIENT_ID is set${NC}"
    fi
    
    if grep -q "SPOTIFY_CLIENT_SECRET=your-spotify-client-secret" .env || grep -q "SPOTIFY_CLIENT_SECRET=$" .env; then
        echo -e "${RED}❌ SPOTIFY_CLIENT_SECRET not configured${NC}"
    else
        echo -e "${GREEN}✅ SPOTIFY_CLIENT_SECRET is set${NC}"
    fi
    
    if grep -q "NEXTAUTH_SECRET=replace-with-a-random-string" .env || grep -q "NEXTAUTH_SECRET=$" .env || ! grep -q "NEXTAUTH_SECRET=" .env; then
        echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET needs to be set${NC}"
        echo "   Generate one with: openssl rand -base64 32"
    else
        echo -e "${GREEN}✅ NEXTAUTH_SECRET is set${NC}"
    fi
    
    if grep -q "DATABASE_URL=" .env; then
        echo -e "${GREEN}✅ DATABASE_URL is set${NC}"
    else
        echo -e "${RED}❌ DATABASE_URL not configured${NC}"
    fi
else
    echo -e "${RED}❌ .env file NOT found${NC}"
    echo "   Run: cp .env.example .env"
    echo "   Then edit .env with your Spotify credentials"
fi

echo ""

# Check 2: Node modules
echo "2️⃣  Checking dependencies..."
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
else
    echo -e "${RED}❌ node_modules NOT found${NC}"
    echo "   Run: npm install"
fi

echo ""

# Check 3: Docker/Database
echo "3️⃣  Checking database..."
if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is available${NC}"
    
    # Check if containers are running
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}✅ Docker containers are running${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker containers are not running${NC}"
        echo "   Run: docker-compose up -d"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not found${NC}"
    echo "   You may need to install Docker or use a different database"
fi

echo ""

# Check 4: Prisma setup
echo "4️⃣  Checking Prisma..."
if [ -d node_modules/.prisma ]; then
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${YELLOW}⚠️  Prisma client not generated${NC}"
    echo "   Run: npx prisma generate"
fi

if [ -d prisma/migrations ]; then
    echo -e "${GREEN}✅ Migrations directory exists${NC}"
else
    echo -e "${RED}❌ Migrations directory NOT found${NC}"
fi

echo ""

# Check 5: Required ports
echo "5️⃣  Checking ports..."
if command -v lsof &> /dev/null; then
    if lsof -i :3000 &> /dev/null; then
        echo -e "${YELLOW}⚠️  Port 3000 is in use${NC}"
        echo "   You may need to stop the existing process"
    else
        echo -e "${GREEN}✅ Port 3000 is available${NC}"
    fi
    
    if lsof -i :5440 &> /dev/null; then
        echo -e "${GREEN}✅ Port 5440 is in use (database likely running)${NC}"
    else
        echo -e "${YELLOW}⚠️  Port 5440 is not in use${NC}"
        echo "   Database may not be running"
    fi
else
    echo -e "${YELLOW}⚠️  Cannot check ports (lsof not available)${NC}"
fi

echo ""

# Check 6: Spotify API connectivity
echo "6️⃣  Checking Spotify API connectivity..."
if command -v curl &> /dev/null; then
    if curl -s -o /dev/null -w "%{http_code}" https://api.spotify.com/v1 | grep -q "40[01]"; then
        echo -e "${GREEN}✅ Spotify API is reachable${NC}"
    else
        echo -e "${YELLOW}⚠️  Unexpected response from Spotify API${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping API check${NC}"
fi

echo ""
echo "=========================="
echo "📋 Summary"
echo "=========================="
echo ""

# Provide next steps
if [ ! -f .env ]; then
    echo -e "${RED}🚨 CRITICAL: Set up .env file first${NC}"
    echo ""
    echo "Next steps:"
    echo "1. cp .env.example .env"
    echo "2. Edit .env with your Spotify credentials"
    echo "3. Run this script again"
elif grep -q "SPOTIFY_CLIENT_ID=your-spotify-client-id" .env 2>/dev/null; then
    echo -e "${RED}🚨 CRITICAL: Configure Spotify credentials in .env${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://developer.spotify.com/dashboard"
    echo "2. Create an app and get Client ID & Secret"
    echo "3. Update .env with your credentials"
    echo "4. Run this script again"
elif ! docker-compose ps 2>/dev/null | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  Start the database${NC}"
    echo ""
    echo "Next steps:"
    echo "1. docker-compose up -d"
    echo "2. npx prisma generate"
    echo "3. npx prisma migrate deploy"
    echo "4. npm run dev"
else
    echo -e "${GREEN}✅ Setup looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm run dev"
    echo "2. Open http://localhost:3000"
    echo "3. Sign in with Spotify"
    echo "4. Check browser console for any errors"
fi

echo ""
echo "📖 See TROUBLESHOOTING_GUIDE.md for detailed help"
echo ""