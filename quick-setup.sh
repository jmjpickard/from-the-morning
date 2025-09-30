#!/bin/bash

# Quick Setup Script for Music Blog
# This will guide you through the setup process interactively

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║    🎵 Music Blog - Quick Setup Wizard 🎵          ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "This script will help you set up your music blog."
echo ""

# Function to prompt for input
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -e "${BLUE}${prompt}${NC}"
    if [ -n "$default" ]; then
        echo -e "${YELLOW}(Default: ${default})${NC}"
    fi
    read -p "> " input
    
    if [ -z "$input" ] && [ -n "$default" ]; then
        input="$default"
    fi
    
    eval "$var_name='$input'"
}

# Step 1: Check if .env already exists
echo -e "${CYAN}Step 1: Checking environment file...${NC}"
echo ""

if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists!${NC}"
    echo ""
    read -p "Do you want to recreate it? (y/N): " recreate
    
    if [[ ! "$recreate" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✅ Keeping existing .env file${NC}"
        echo ""
        skip_env=true
    else
        echo -e "${YELLOW}Backing up existing .env to .env.backup${NC}"
        cp .env .env.backup
        skip_env=false
    fi
else
    skip_env=false
fi

# Step 2: Create .env file
if [ "$skip_env" != true ]; then
    echo -e "${CYAN}Step 2: Setting up environment variables...${NC}"
    echo ""
    echo "You'll need:"
    echo "  1. Spotify Developer credentials (https://developer.spotify.com/dashboard)"
    echo "  2. A random string for session security"
    echo ""
    read -p "Press Enter to continue..."
    echo ""
    
    # Spotify Client ID
    prompt_with_default "Enter your Spotify Client ID:" "" SPOTIFY_CLIENT_ID
    
    # Spotify Client Secret
    prompt_with_default "Enter your Spotify Client Secret:" "" SPOTIFY_CLIENT_SECRET
    
    # Generate or input NextAuth Secret
    echo ""
    echo -e "${BLUE}Do you want to auto-generate a NextAuth secret?${NC}"
    read -p "(Y/n): " auto_generate
    
    if [[ ! "$auto_generate" =~ ^[Nn]$ ]]; then
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
        echo -e "${GREEN}✅ Generated: ${NEXTAUTH_SECRET}${NC}"
    else
        prompt_with_default "Enter your NextAuth secret:" "" NEXTAUTH_SECRET
    fi
    
    # Other settings
    echo ""
    prompt_with_default "Database URL:" "postgresql://postgres:postgres@localhost:5440/postgres" DATABASE_URL
    prompt_with_default "App URL:" "http://localhost:3000" NEXTAUTH_URL
    prompt_with_default "Spotify Base URL:" "https://api.spotify.com/v1" SPOTIFY_BASE_URL
    SPOTIFY_REDIRECT_URI="${NEXTAUTH_URL}/api/auth/callback/spotify"
    
    # Write .env file
    echo ""
    echo -e "${YELLOW}Creating .env file...${NC}"
    
    cat > .env << EOF
# --- Core ---
NODE_ENV=development
NEXTAUTH_URL=${NEXTAUTH_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# --- Database ---
DATABASE_URL=${DATABASE_URL}

# --- Spotify ---
SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
SPOTIFY_BASE_URL=${SPOTIFY_BASE_URL}
SPOTIFY_REDIRECT_URI=${SPOTIFY_REDIRECT_URI}
EOF
    
    echo -e "${GREEN}✅ .env file created!${NC}"
    echo ""
else
    echo -e "${CYAN}Step 2: Skipping environment setup${NC}"
    echo ""
fi

# Step 3: Check Spotify Developer Dashboard
echo -e "${CYAN}Step 3: Verifying Spotify configuration...${NC}"
echo ""
echo "⚠️  IMPORTANT: Make sure your Spotify app settings include this redirect URI:"
echo ""
echo -e "${YELLOW}   ${SPOTIFY_REDIRECT_URI:-http://localhost:3000/api/auth/callback/spotify}${NC}"
echo ""
echo "Go to: https://developer.spotify.com/dashboard"
echo "  → Select your app"
echo "  → Settings"
echo "  → Redirect URIs"
echo "  → Add the URI above"
echo ""
read -p "Press Enter when you've verified this..."
echo ""

# Step 4: Install dependencies
echo -e "${CYAN}Step 4: Installing dependencies...${NC}"
echo ""

if [ -d node_modules ]; then
    echo -e "${GREEN}✅ node_modules already exists${NC}"
    read -p "Reinstall dependencies? (y/N): " reinstall
    
    if [[ "$reinstall" =~ ^[Yy]$ ]]; then
        echo "Running npm install..."
        npm install
    fi
else
    echo "Running npm install..."
    npm install
fi
echo ""

# Step 5: Database setup
echo -e "${CYAN}Step 5: Setting up database...${NC}"
echo ""

if [[ "$DATABASE_URL" == postgresql* ]]; then
    echo "PostgreSQL detected. Checking Docker..."
    
    if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
        echo -e "${GREEN}✅ Docker is available${NC}"
        
        read -p "Start database with Docker Compose? (Y/n): " start_docker
        
        if [[ ! "$start_docker" =~ ^[Nn]$ ]]; then
            echo "Starting database..."
            docker-compose up -d
            echo "Waiting for database to be ready..."
            sleep 5
        fi
    else
        echo -e "${YELLOW}⚠️  Docker not found. Make sure PostgreSQL is running.${NC}"
        read -p "Press Enter to continue..."
    fi
else
    echo "Using SQLite or other database..."
fi
echo ""

# Step 6: Prisma setup
echo -e "${CYAN}Step 6: Setting up Prisma...${NC}"
echo ""

echo "Generating Prisma client..."
npx prisma generate

echo ""
echo "Running database migrations..."
npx prisma migrate deploy

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""

# Step 7: Final checks
echo -e "${CYAN}Step 7: Running diagnostics...${NC}"
echo ""

if [ -f diagnose.sh ]; then
    ./diagnose.sh
else
    echo -e "${YELLOW}⚠️  diagnose.sh not found, skipping...${NC}"
fi

# Final instructions
echo ""
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║           ✅ Setup Complete! ✅                    ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "${GREEN}1. Start the development server:${NC}"
echo -e "   ${CYAN}npm run dev${NC}"
echo ""
echo -e "${GREEN}2. Open in your browser:${NC}"
echo -e "   ${CYAN}${NEXTAUTH_URL:-http://localhost:3000}${NC}"
echo ""
echo -e "${GREEN}3. Sign in with Spotify${NC}"
echo -e "   (Use the account that has Premium)"
echo ""
echo -e "${GREEN}4. Check browser console for any errors${NC}"
echo -e "   (F12 → Console tab)"
echo ""
echo "📖 Need help? Check these files:"
echo "   • TROUBLESHOOTING_GUIDE.md - Detailed troubleshooting"
echo "   • DIAGNOSIS_SUMMARY.md - Understanding the issues"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "   • You need Spotify Premium for playback control"
echo "   • Open Spotify app to see additional devices"
echo "   • Web player will auto-initialize in browser"
echo ""
echo "Happy listening! 🎵"
echo ""