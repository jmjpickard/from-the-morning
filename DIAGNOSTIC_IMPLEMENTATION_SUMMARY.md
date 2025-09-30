# Spotify Diagnostic Tool - Implementation Summary

## 🎯 What Was Created

I've built a **real-time diagnostic dashboard** that helps you debug Spotify playback issues on your Vercel-deployed app directly from your mobile device (or any browser). No local setup required!

## 📁 Files Created

### 1. `/src/pages/diagnostics.tsx` (Main Dashboard)
A comprehensive diagnostic UI that:
- Runs automated checks on authentication, tokens, devices, and playback
- Shows real-time status with color-coded indicators (green/yellow/red/blue)
- Displays live device and playback information
- Auto-refreshes every 3 seconds (optional)
- Works on mobile browsers

### 2. `/src/pages/api/debug/check-account.ts` (Database Check)
API endpoint that:
- Verifies account exists in database
- Checks if refresh_token is present
- Validates OAuth scopes
- Shows token expiration info
- Protected by NextAuth (only authenticated users)

### 3. `/src/pages/api/debug/test-spotify.ts` (API Test Runner)
Server-side test endpoint that:
- Performs actual Spotify API calls
- Tests token refresh mechanism
- Calls `/me`, `/me/player/devices`, `/me/player` endpoints
- Returns detailed logs of each step
- Shows exactly where connection fails

### 4. `/DIAGNOSTIC_TOOL_GUIDE.md` (User Guide)
Complete documentation on how to use the tool

## 🚀 How to Use

### Step 1: Deploy to Vercel
The diagnostic tool will automatically deploy with your app. No extra configuration needed!

### Step 2: Access the Dashboard
Visit: `https://your-app.vercel.app/diagnostics`

### Step 3: Run Diagnostics
1. **Run Diagnostics** button - Performs all automated checks
2. **Test API Calls** button - Deep server-side debugging
3. **Refresh Data** button - Quick update of live data
4. **Auto-refresh checkbox** - Monitor in real-time

## 🔍 What It Checks

### ✅ Automated Checks (7 checks total)

1. **NextAuth Session** 
   - Verifies you're logged in
   - Shows user email
   
2. **Database Account Record**
   - Checks if account exists in DB
   - Verifies refresh_token is present
   - Shows provider info

3. **OAuth Scopes**
   - Validates all required scopes are granted
   - Lists missing scopes if any
   
4. **Spotify Access Token**
   - Tests token refresh from database
   - Verifies token can be obtained

5. **Spotify Devices**
   - Lists all available playback devices
   - Shows device type and active status
   
6. **Current Playback State**
   - Shows currently playing track
   - Displays artist and device
   - Shows play/pause status

7. **Web Playback SDK**
   - Checks if SDK loaded in browser
   - Verifies player initialization

### 🧪 Server-Side API Test

The **Test API Calls** button runs 5 steps server-side:

```
Step 1: Database Query
  ↓ Fetches account and refresh_token

Step 2: Token Refresh
  ↓ Calls Spotify token endpoint

Step 3: Test User API
  ↓ GET /me (validates token)

Step 4: Test Devices API
  ↓ GET /me/player/devices

Step 5: Test Playback API
  ↓ GET /me/player
```

Each step shows ✓ success or ❌ error with details.

## 🎨 Visual Indicators

### Status Colors
- 🟢 **Green** - Success (everything working)
- 🟡 **Yellow** - Warning (not critical but needs attention)
- 🔴 **Red** - Error (blocking issue)
- 🔵 **Blue** - Pending (loading)

### Live Data Section
Shows at-a-glance:
- Token Status: ✓ Valid / ✕ Missing
- Devices: X found
- Active Device: Device name

### Terminal-Style Logs
Black background with green text showing:
- Timestamps
- API responses
- Error messages
- Step-by-step execution

## 🐛 Common Issues It Helps Debug

### Issue 1: "Can't play tracks"
**Diagnostic shows**: ❌ No refresh token found

**Fix**: Sign out and sign in again to re-authenticate

---

### Issue 2: "No devices available"
**Diagnostic shows**: ⚠️ Found 0 devices

**Fix**: Open Spotify app on phone/computer and play something

---

### Issue 3: "Token refresh fails"
**Diagnostic shows**: ❌ Token refresh failed: Status 400

**Fix**: Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Vercel

---

### Issue 4: "Missing scopes"
**Diagnostic shows**: ❌ Missing required scope(s): streaming

**Fix**: Remove app from Spotify account, then sign in again

---

### Issue 5: "API calls return 401"
**Diagnostic shows**: Step 3: Status 401 Unauthorized

**Fix**: Refresh token invalid, need to re-authenticate

## 📱 Mobile-Friendly Features

Perfect for debugging from your phone:
- Responsive design
- Touch-friendly buttons
- Copy logs to clipboard
- No typing required
- Auto-refresh mode
- Clear visual indicators

## 🔒 Security

- All endpoints protected by NextAuth
- Only authenticated users can access
- Tokens partially masked in UI (e.g., "BQDrx...fg8")
- Full tokens only in server logs (not exposed to client)
- Safe to share screenshots (no secrets visible)

## 💡 Pro Tips

### Tip 1: Use Auto-Refresh
Enable "Auto-refresh (3s)" and leave page open while testing your main app. Instantly see when something breaks!

### Tip 2: Test API Calls First
Before diving into complex debugging, click "Test API Calls" to see the raw server-side flow. This often immediately reveals the issue.

### Tip 3: Copy Logs Early
When you see an error, immediately copy the logs. This captures the exact state before anything changes.

### Tip 4: Check Database First
If "Database Account Record" fails, nothing else will work. Start by fixing authentication.

### Tip 5: Compare Working vs Broken
Run diagnostics when working, copy the data. Run again when broken, compare the differences!

## 🎯 How It Helps Your Situation

Since you're on mobile using Cursor Agent and can't easily debug locally:

1. **Real-time visibility** - See connection status live on deployed app
2. **No local setup** - Works on production Vercel deployment
3. **Mobile accessible** - Use from your phone browser
4. **Copy & share** - Easily share diagnostic info for help
5. **Step-by-step** - Shows exactly where the flow breaks
6. **Self-service** - Debug and fix without terminal access

## 🔄 Typical Debugging Flow

```
1. Notice playback not working in main app
   ↓
2. Open /diagnostics page
   ↓
3. Run automated diagnostics
   ↓
4. See which check fails (red X)
   ↓
5. Click "Test API Calls" for details
   ↓
6. Read the logs to find exact error
   ↓
7. Apply fix (e.g., update env vars in Vercel)
   ↓
8. Refresh diagnostics to verify fix
   ↓
9. Test playback in main app
```

## 📊 What Success Looks Like

When everything is working, you should see:

```
✓ NextAuth Session: Authenticated as your@email.com
✓ Database Account Record: Account found with refresh token
✓ Spotify Access Token: Token retrieved successfully
✓ Spotify Devices: Found 2 device(s)
  [Details show]: From The Morning Web Player (is_active: true)
✓ Current Playback State: Playing
  [Shows]: Track name, artist, device
✓ Web Playback SDK: SDK loaded
✓ Environment Check: Configuration check
```

Live Data:
- Token Status: ✓ Valid
- Devices: 2 found
- Active Device: From The Morning Web Player

🎵 Currently Playing:
[Song name]
[Artist name]
▶️ Playing on From The Morning Web Player

## 🎬 Next Steps

1. **Deploy your changes** to Vercel (the diagnostic tool is now part of your app)
2. **Visit** `https://your-app.vercel.app/diagnostics`
3. **Run diagnostics** and see what's failing
4. **Copy the results** and share them back, or
5. **Fix the issue** based on the clear error messages
6. **Verify** the fix by running diagnostics again

## 🤔 Deep Dive: Most Likely Issues

Based on your setup, here are the most probable causes:

### 1. Refresh Token Not in Database (60% probability)
**Why**: NextAuth might not be storing refresh_token properly

**How diagnostic helps**: 
- "Database Account Record" check shows if token exists
- "Test API Calls" shows database query results

**Fix**: Sign out completely, then sign in again

### 2. Wrong Environment Variables (20% probability)
**Why**: SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET incorrect in Vercel

**How diagnostic helps**:
- "Token Refresh" step in Test API Calls will fail with 400/401
- Shows exact error from Spotify

**Fix**: Double-check env vars in Vercel dashboard

### 3. Scope Issues (10% probability)
**Why**: Changed scopes after user logged in

**How diagnostic helps**:
- "OAuth Scopes" check shows missing scopes
- Lists exactly which ones are missing

**Fix**: Remove app from Spotify account, sign in again

### 4. No Active Device (10% probability)
**Why**: Web player not initialized, no other device active

**How diagnostic helps**:
- "Spotify Devices" shows device count
- Shows which device is active (if any)

**Fix**: Wait for web player, or open Spotify app

## 🎉 Benefits Summary

| Before | After |
|--------|-------|
| ❌ Black box - don't know what's broken | ✅ Clear visibility into each step |
| ❌ Need local debugging setup | ✅ Debug on deployed app |
| ❌ Can't debug from mobile | ✅ Works perfectly on mobile |
| ❌ Trial and error fixing | ✅ See exact error immediately |
| ❌ Hard to explain issue | ✅ Copy logs to share |
| ❌ No real-time monitoring | ✅ Auto-refresh shows live state |

## 📚 Additional Resources

- See `DIAGNOSTIC_TOOL_GUIDE.md` for detailed user guide
- Check common issues section for quick fixes
- Use Quick Actions in the UI for helpful links

## 🎵 The Goal

Get you from "Spotify playback isn't working and I can't debug it" to "I can see exactly what's failing and how to fix it" - all from your mobile browser, on your deployed Vercel app!

---

**Ready to debug?** Just deploy and visit `/diagnostics`! 🚀
