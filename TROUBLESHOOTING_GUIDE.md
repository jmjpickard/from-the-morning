# Music Blog Troubleshooting Guide

## 🔍 Problem Analysis

Based on the screenshot showing:
- ❌ Song details not loading (empty album art, no track/artist names)
- ⚠️ Yellow warning icon on play buttons
- ⚠️ "No active device selected" banner at bottom
- ❌ Shows "Unknown track" / "Unknown artist"

## 🎯 Root Causes Identified

### 1. Missing Environment Configuration (CRITICAL)
**Status:** ❌ `.env` file does not exist  
**Impact:** Cannot connect to Spotify API, database, or authenticate users

### 2. Access Token Chain Failure
**Status:** ⚠️ Without env vars, the entire authentication chain fails  
**Impact:** All Spotify API calls return errors/empty responses

### 3. Device Detection Failure
**Status:** ⚠️ Cannot fetch available devices without valid token  
**Impact:** Cannot initialize playback on any device

## 🛠️ Step-by-Step Fix Guide

### Step 1: Set Up Spotify Developer Account

1. Go to https://developer.spotify.com/dashboard
2. Create a new application (or use existing)
3. Note down:
   - **Client ID**
   - **Client Secret**
4. In the app settings, add redirect URI:
   - `http://localhost:3000/api/auth/callback/spotify`
5. Ensure your Spotify account is **Premium** (required for playback control)

### Step 2: Create Environment File

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your actual values:

```bash
# --- Core ---
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# --- Database ---
DATABASE_URL=postgresql://postgres:postgres@localhost:5440/postgres

# --- Spotify ---
SPOTIFY_CLIENT_ID=<your-actual-spotify-client-id>
SPOTIFY_CLIENT_SECRET=<your-actual-spotify-client-secret>
SPOTIFY_BASE_URL=https://api.spotify.com/v1
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

### Step 3: Generate NextAuth Secret

```bash
# Generate a secure random string
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env` file.

### Step 4: Start Database

```bash
# Start PostgreSQL via Docker Compose
docker-compose up -d
```

Verify it's running:
```bash
docker-compose ps
```

### Step 5: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Optional: View your database
npx prisma studio
```

### Step 6: Install Dependencies (if not done)

```bash
npm install
```

### Step 7: Start Development Server

```bash
npm run dev
```

### Step 8: Authenticate with Spotify

1. Open http://localhost:3000
2. Click "Sign in with Spotify"
3. Authorize the application
4. You should be redirected back to the app

### Step 9: Verify Device Detection

**Option A: Use Spotify Desktop/Mobile App**
1. Open Spotify on your desktop or mobile
2. Start playing any song
3. Refresh your web app
4. The device should appear in the device selector

**Option B: Use Web Playback SDK (Browser Player)**
1. The app will automatically initialize a web player called "From The Morning Web Player"
2. Check browser console for: `"Ready with Device ID"`
3. The web player should auto-select as active device
4. Click the device selector to see available devices

## 🔬 Debugging Checklist

### Check Browser Console (F12)

Look for these log messages:

✅ **Success Indicators:**
```
"Ready with Device ID: <device-id>"
"The Web Playback SDK successfully connected to Spotify!"
"Web Playback SDK ready with device ID: <device-id>"
```

❌ **Error Indicators:**
```
"Authentication error: ..."
"Error fetching devices"
"No active device - cannot play track"
"Failed to refresh access token"
```

### Check Network Tab

1. Open DevTools → Network tab
2. Filter for `api.spotify.com`
3. Look for failed requests (status 401, 403, 400)
4. Check request headers for Authorization token

### Check Database

```bash
# Open Prisma Studio
npx prisma studio
```

Verify:
- **User** record exists (after sign-in)
- **Account** record exists with:
  - `provider: "spotify"`
  - `refresh_token` is populated (long string)
  - `access_token` may be empty (gets refreshed)

### Check tRPC Queries

In browser console, check these API calls:
```javascript
// Should return a valid token string
api.user.getAccessToken.useQuery()

// Should return array of devices
api.player.getDevices.useQuery({ accessToken: "..." })

// Should return track info
api.player.getTrack.useQuery({ trackId: "...", accessToken: "..." })
```

## 🔧 Common Issues & Solutions

### Issue: "No active device selected"

**Possible Causes:**
1. No Spotify client is open and playing
2. Web Playback SDK failed to initialize
3. Spotify Premium is required

**Solutions:**
- Open Spotify desktop/mobile and start playing
- Check browser console for SDK initialization errors
- Verify you have Spotify Premium
- Click "Select Device" button and manually choose a device

### Issue: Track details showing "Unknown track"

**Possible Causes:**
1. Access token is empty or invalid
2. Track ID is incorrect
3. Spotify API credentials are wrong

**Solutions:**
- Check browser console for `getTrack` API errors
- Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env`
- Check Network tab for 401/403 errors
- Sign out and sign in again to refresh tokens

### Issue: Web Playback SDK not initializing

**Possible Causes:**
1. Access token not available
2. Not a Premium account
3. Browser doesn't support Web Playback SDK

**Solutions:**
- Verify Spotify Premium subscription
- Try in Chrome/Edge (best support)
- Check for browser console errors
- Ensure access token includes "streaming" scope (already configured in `auth.ts`)

### Issue: "Failed to refresh access token"

**Possible Causes:**
1. Spotify credentials are incorrect
2. Refresh token is invalid/expired
3. Network issues

**Solutions:**
- Double-check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Sign out and sign in again
- Check if Spotify API is accessible from your network

## 📊 Data Flow Diagram

```
User Signs In
    ↓
Spotify OAuth → Stores refresh_token in DB
    ↓
App requests access_token (via refresh_token)
    ↓
Access token used for ALL Spotify API calls:
    ├── Get Devices
    ├── Get Track Info
    ├── Get Playback State
    ├── Control Playback
    └── Initialize Web Player
```

## 🧪 Test Script

Create a test to verify everything works:

```bash
# 1. Check environment
cat .env | grep SPOTIFY_CLIENT_ID
cat .env | grep SPOTIFY_CLIENT_SECRET

# 2. Check database is running
docker-compose ps

# 3. Check if server starts without errors
npm run dev

# 4. Open browser and check console logs
# Navigate to http://localhost:3000
```

## 📝 Next Steps After Setup

Once everything is working:

1. **Add blog posts** - Use the "New" page to add songs with commentary
2. **Test playback** - Click play buttons to verify playback control
3. **Switch devices** - Click device selector to transfer playback
4. **Check all features**:
   - ✅ Song details load with album art
   - ✅ Play/pause buttons work
   - ✅ Device selector shows available devices
   - ✅ Progress bar updates
   - ✅ Volume control works
   - ✅ Skip next/previous works

## 🆘 Still Having Issues?

If problems persist after following this guide:

1. **Share browser console logs** - Copy all errors from Console tab
2. **Share network errors** - Screenshot failed requests from Network tab
3. **Share server logs** - Copy terminal output where `npm run dev` is running
4. **Verify Spotify account** - Confirm Premium status and that you can play music normally

## 💡 Key Files to Check

- `/workspace/.env` - Environment configuration
- `/workspace/src/server/auth.ts` - OAuth scopes (line 57)
- `/workspace/src/server/api/userService.ts` - Token refresh logic
- `/workspace/src/hooks/useSpotifyWebPlayback.ts` - Web player initialization
- `/workspace/src/components/Player.tsx` - Main player context logic
- `/workspace/src/components/BlogEntry.tsx` - Track fetching logic

## 🔐 Security Notes

- Never commit `.env` file to git (already in `.gitignore`)
- Never share your `SPOTIFY_CLIENT_SECRET` publicly
- Rotate your `NEXTAUTH_SECRET` periodically in production
- Use environment-specific values for production deployment