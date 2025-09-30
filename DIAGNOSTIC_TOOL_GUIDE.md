# Spotify Diagnostic Tool Guide

## 🎯 Purpose

This diagnostic tool helps you debug Spotify playback issues in your deployed Vercel app **in real-time** without needing local development setup. Perfect for mobile debugging!

## 🚀 How to Access

Once deployed to Vercel, visit:
```
https://your-app.vercel.app/diagnostics
```

## 🔍 What It Does

The diagnostic page performs comprehensive checks on your Spotify integration:

### Automated Checks

1. **NextAuth Session** - Verifies you're logged in
2. **Database Account Record** - Checks if refresh_token exists in database
3. **OAuth Scopes** - Validates all required scopes are granted
4. **Spotify Access Token** - Tests token refresh mechanism
5. **Spotify Devices** - Lists all available playback devices
6. **Current Playback State** - Shows what's currently playing
7. **Web Playback SDK** - Verifies browser player initialization
8. **Environment Check** - Confirms configuration

### Manual Tests

- **Test API Calls** button - Runs a comprehensive server-side test that:
  - Fetches account from database
  - Refreshes access token
  - Calls Spotify API endpoints directly
  - Shows detailed logs of each step
  - Identifies exactly where the connection fails

## 📊 Understanding the Results

### Status Colors

- 🟢 **Green (Success)** - Everything working correctly
- 🟡 **Yellow (Warning)** - Not critical but needs attention
- 🔴 **Red (Error)** - Critical issue blocking functionality
- 🔵 **Blue (Pending)** - Still loading

### Common Issues & Solutions

#### ❌ "No refresh token found"
**Cause**: Database missing refresh_token for your account

**Solutions**:
1. Sign out from the app
2. Sign in again to re-authenticate with Spotify
3. If still fails, check Spotify Developer Dashboard for correct redirect URI

#### ❌ "Missing required scopes"
**Cause**: OAuth scopes were changed after you logged in

**Solutions**:
1. Sign out from the app
2. Go to https://www.spotify.com/account/apps/
3. Remove your app from authorized apps
4. Sign in again to grant new scopes

#### ❌ "No devices found"
**Cause**: No Spotify playback devices are active

**Solutions**:
1. Open Spotify app on your phone or computer
2. Play any song (even for 1 second, then pause)
3. Wait 5-10 seconds for Web Player to initialize
4. Refresh the diagnostics page

#### ❌ "Token refresh failed"
**Cause**: Invalid client credentials or refresh token expired

**Solutions**:
1. Check Vercel environment variables:
   - `SPOTIFY_CLIENT_ID` 
   - `SPOTIFY_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
2. Verify credentials match your Spotify Developer Dashboard
3. Try signing out and back in

#### ⚠️ "No active device"
**Cause**: Devices exist but none selected as active

**Solutions**:
1. Click on a device in your app to activate it
2. Or use the device selection dialog
3. Or play something in Spotify app to activate a device

## 🔧 Using the Tool

### Step 1: Run Initial Diagnostics
1. Visit `/diagnostics` on your deployed app
2. Wait for automatic checks to complete
3. Review all status indicators

### Step 2: Test API Calls
1. Click **"Test API Calls"** button
2. Wait for server-side test to complete (~5-10 seconds)
3. Review the detailed logs in terminal-style output
4. Look for ❌ errors or ⚠️ warnings

### Step 3: Copy and Share Results
1. Click **"Copy Diagnostic Data"** to copy full report
2. Or click **"📋 Copy Logs"** under test results
3. Paste into a message to share with support or save for reference

### Step 4: Monitor in Real-Time
1. Enable **"Auto-refresh (3s)"** checkbox
2. Leave page open while testing playback
3. Watch live updates of devices and playback state
4. See immediately when issues occur

## 🎵 Testing Playback Flow

To test if playback works after fixes:

1. **Ensure Device Available**
   - Check diagnostics shows at least 1 device
   - Verify device is marked as "active" (green indicator)

2. **Test from Main App**
   - Go back to main app
   - Try playing a track
   - If fails, immediately return to diagnostics

3. **Check What Changed**
   - Look at "Current Playback State" section
   - See if error appeared in any checks
   - Use "Test API Calls" for detailed error info

## 🐛 Deep Debugging with Test API Calls

The **Test API Calls** feature is most powerful for finding issues:

**What it tests:**
1. Database connectivity and account lookup
2. Token refresh with Spotify API
3. GET /me - User profile (validates token works)
4. GET /me/player/devices - Device list
5. GET /me/player - Current playback state

**How to read the logs:**
- Each section starts with `--- Step X: ... ---`
- ✓ means success
- ❌ means failure (this is where your issue is!)
- ⚠️ means warning (might be normal)
- Status codes shown for each API call

**Example successful log:**
```
--- Step 2: Token Refresh ---
✓ Access token obtained: BQDrx9...

--- Step 3: Test Spotify API ---
Status: 200 OK
✓ Successfully authenticated as: YourName
  Product: premium
```

**Example failed log:**
```
--- Step 2: Token Refresh ---
❌ Token refresh failed: Failed to refresh access token. Status: 400

This tells you: Client credentials are wrong in Vercel!
```

## 📱 Mobile Usage Tips

Since you're using this on mobile via Cursor Agent:

1. **Bookmark the diagnostics page** for quick access
2. **Take screenshots** of error states to reference later
3. **Use "Copy" buttons** to save logs to clipboard
4. **Enable auto-refresh** to monitor without manual refreshes
5. **Keep page open** in another tab while testing main app

## 🔒 Security Note

The diagnostic endpoints are protected by NextAuth. Only authenticated users can access them. However:

- Token values are partially hidden (e.g., "BQDrx...fg8")
- Full tokens never shown in UI (only in server logs)
- Be careful when sharing copied diagnostic data publicly

## 🚨 When to Use Each Feature

| Feature | Use When |
|---------|----------|
| **Run Diagnostics** | First time checking or after changes |
| **Refresh Data** | Quick update of device/playback status |
| **Test API Calls** | Deep debugging when something's not working |
| **Auto-refresh** | Monitoring playback in real-time |
| **Copy Data** | Sharing results or saving for reference |

## ✅ Expected Working State

When everything is working correctly, you should see:

```
✓ NextAuth Session: Authenticated as your@email.com
✓ Database Account Record: Account found with refresh token
✓ Spotify Access Token: Token retrieved successfully
✓ Spotify Devices: Found 2 device(s)
✓ Current Playback State: Playing
✓ Web Playback SDK: SDK loaded
```

And the live data section should show:
- Token Status: ✓ Valid
- Devices: 2 found
- Active Device: From The Morning Web Player

## 🎯 Next Steps

After identifying the issue:

1. **If token issues**: Check Vercel environment variables
2. **If scope issues**: Sign out and sign in again
3. **If device issues**: Open Spotify app or wait for web player
4. **If still stuck**: Copy logs and review the specific error message

The diagnostic tool shows you **exactly** what's broken and **where** in the flow it breaks, making it much easier to fix without local debugging!

## 🔄 Deployment

The diagnostic tool is just regular Next.js pages and API routes. It will automatically deploy with your app to Vercel. No special configuration needed!

Files added:
- `/src/pages/diagnostics.tsx` - Main diagnostic UI
- `/src/pages/api/debug/check-account.ts` - Account check endpoint
- `/src/pages/api/debug/test-spotify.ts` - Spotify API test endpoint
