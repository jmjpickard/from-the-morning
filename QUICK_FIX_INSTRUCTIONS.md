# 🚀 Quick Fix Instructions

## Problem Summary
You're missing 3 OAuth scopes (`user-read-currently-playing`, `user-read-recently-played`, `streaming`) because your database has an old account record from before these scopes were added to the code.

## ⚡ Quick Fix (30 seconds)

1. Go to your deployed app: `https://from-the-morning.vercel.app/diagnostics`
2. Wait for diagnostics to run automatically
3. Look for the red **"Force Re-Authentication"** button in the "Quick Actions" section
4. Click it and confirm
5. You'll be signed out automatically
6. Sign back in with Spotify
7. Grant all permissions when prompted
8. Done! Check diagnostics again to verify

## What Changed

### New Files Added:
- `/src/pages/api/debug/force-reauth.ts` - API endpoint to safely delete account and force re-auth
- `SPOTIFY_TROUBLESHOOTING_SOLUTION.md` - Comprehensive troubleshooting guide
- This file!

### Files Modified:
- `/src/pages/diagnostics.tsx` - Added force re-auth button and better error messages

## What Will Fix:
✅ Missing OAuth scopes error  
✅ No devices found issue (after opening Spotify app)  
✅ Playback control capabilities  
✅ Streaming functionality  

## After Re-Authentication

Once you've signed in again with new scopes:

1. **Open Spotify** on your phone or computer
2. **Play any song** (even for 1 second)
3. **Refresh the diagnostics page**
4. You should now see devices listed!

## Important Notes:
- ⚠️ **Spotify Premium is REQUIRED** for playback control
- The "Force Re-Authentication" button only appears if scopes are missing
- This is safe - it only deletes YOUR account record, not your Spotify account
- All your data stays intact; just the OAuth tokens are reset

## Verification Checklist:
After re-auth, your diagnostics should show:
- [x] NextAuth Session: ✓ Authenticated
- [x] Database Account Record: ✓ Has refresh token
- [x] OAuth Scopes: ✓ All 6 scopes present (no error)
- [x] Spotify Access Token: ✓ Valid
- [x] Spotify Devices: ✓ 1+ found (after opening Spotify)
- [x] Current Playback: ✓ Shows track info (if playing)

## Need More Help?
See `SPOTIFY_TROUBLESHOOTING_SOLUTION.md` for detailed explanations and advanced troubleshooting.
