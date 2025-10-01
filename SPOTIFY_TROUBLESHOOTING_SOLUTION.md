# 🔧 Spotify Integration Troubleshooting Solution

## 🔍 Issues Identified

Based on your diagnostics screenshots, you're experiencing two related problems:

### 1. **Missing OAuth Scopes** ❌
- **Missing**: `user-read-currently-playing`, `user-read-recently-played`, `streaming`
- **Root Cause**: Your database has an old Account record from before these scopes were added to the code
- **Impact**: Without these scopes, Spotify API calls for playback and device control will fail

### 2. **No Devices Found** ⚠️
- **Status**: 0 devices available
- **Primary Cause**: Missing `streaming` scope (see issue #1)
- **Secondary Causes**: 
  - No Spotify app actively open/playing
  - Web Playback SDK hasn't initialized
  - Account may not have Spotify Premium (required for playback control)

## ✅ Solution Steps

### Option A: Automated Fix (Recommended)

1. **Go to your diagnostics page** at `/diagnostics`
2. **Click "Run Diagnostics"** to verify the OAuth Scopes error
3. **Click the red "Force Re-Authentication" button** that appears in the Quick Actions section
4. **Confirm the action** when prompted
5. **You'll be automatically signed out** and redirected
6. **Sign in again with Spotify** - you'll see the new permission requests
7. **Grant all permissions** when Spotify prompts you
8. **Return to diagnostics page** to verify all scopes are now present

### Option B: Manual Fix

If you prefer to do it manually:

1. **Sign out** of your application
2. **Manually delete the Account record** from your database:
   ```sql
   DELETE FROM "Account" WHERE "userId" = 'your-user-id';
   ```
3. **Sign in again** - NextAuth will create a new Account record with all current scopes

### Option C: Database Direct Update (Not Recommended)

You could theoretically update the `scope` field directly in the database, but this is NOT recommended because:
- The existing tokens don't have permissions for the new scopes
- Spotify won't honor the new scopes until you re-authorize
- You'll still have permission errors

## 🎯 What Fixed Code Does

I've added the following improvements to your diagnostics page:

### 1. **New API Endpoint**: `/api/debug/force-reauth`
- Safely deletes your account record
- Provides detailed logging
- Requires POST method for safety
- Only deletes YOUR account (based on session)

### 2. **Updated Diagnostics UI**
- Shows a prominent red "Force Re-Authentication" button when scopes are missing
- Provides clear instructions in error messages
- Highlights your specific issue at the top of "Common Issues"
- Automatically signs you out after forcing re-auth

### 3. **Better Error Messages**
- OAuth Scopes error now points to the solution button
- "Common Issues" section highlights the scope problem as your current issue
- Explains WHY this happens (developer adds scopes, existing users keep old ones)

## 📋 Verification Checklist

After re-authenticating, verify these items on the diagnostics page:

- [ ] ✓ NextAuth Session shows as authenticated
- [ ] ✓ Database Account Record has refresh token
- [ ] ✓ OAuth Scopes check passes (no missing scopes error)
- [ ] ✓ Spotify Access Token retrieved successfully
- [ ] ✓ Token Status shows "Valid"

## 🎵 Getting Devices to Appear

After fixing the OAuth scopes, to get devices:

### For Desktop/Mobile App:
1. Open Spotify on your computer or phone
2. Start playing ANY song (even for 1 second)
3. Wait 5-10 seconds
4. Refresh the diagnostics page
5. You should see your device(s) listed

### For Web Playback SDK:
1. The SDK initializes when the Player component mounts
2. It creates a device called "Web Playback SDK" or similar
3. This requires the `streaming` scope (which you'll have after re-auth)
4. It may take 5-10 seconds to appear after page load

### Important Notes:
- **Spotify Premium is REQUIRED** for playback control and Web SDK
- Free accounts can see devices but cannot control playback
- Some device types may not be controllable via API

## 🔄 Why This Happens

This is a common OAuth issue when developing applications:

1. You initially created the app with basic scopes
2. Later, you added more scopes to `src/server/auth.ts`
3. **Existing database records retained the old scopes**
4. New users would get the new scopes, but existing users wouldn't
5. Solution: Force existing users to re-authenticate

## 🛡️ Preventing This In Production

For production applications, when adding new OAuth scopes:

1. **Add a scope version field** to track which scopes users have
2. **Check scope version on login** and prompt re-auth if outdated
3. **Gracefully handle missing permissions** with clear user prompts
4. **Log scope mismatches** for monitoring

Example approach:
```typescript
// Check if user needs re-auth
const needsReauth = !account.scope?.includes('streaming');
if (needsReauth) {
  // Show modal: "We've added new features! Please reconnect your Spotify account"
  // Button: "Reconnect Spotify" -> triggers force-reauth
}
```

## 📊 Expected Results After Fix

Once you've re-authenticated with the new scopes:

### Diagnostics Page Should Show:
```
✓ NextAuth Session: Authenticated as jack.pickard@hotmail.com
✓ Database Account Record: Account found with refresh token
✓ OAuth Scopes: All 6 required scopes present
✓ Spotify Access Token: Token retrieved successfully
✓ Spotify Devices: Found 1+ device(s)
✓ Current Playback State: Playing/Paused (if something is playing)
```

### You'll Be Able To:
- See all available Spotify devices
- Control playback (play, pause, skip)
- See currently playing track
- Adjust volume
- Transfer playback between devices

## 🆘 If Problems Persist

If you still have issues after re-authenticating:

1. **Check Spotify Account Type**
   - Go to https://www.spotify.com/account/
   - Verify you have Spotify Premium
   - Free accounts cannot control playback

2. **Verify Spotify App Settings**
   - Go to https://developer.spotify.com/dashboard/
   - Check your app status (should be in "Development" or "Extended Quota Mode")
   - Verify Redirect URIs match your deployment URL

3. **Check Environment Variables**
   - Verify `SPOTIFY_CLIENT_ID` is set correctly
   - Verify `SPOTIFY_CLIENT_SECRET` is set correctly
   - Verify `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your deployment URL

4. **Test Raw API Calls**
   - Use the "Test API Calls" button on diagnostics page
   - Check the logs for specific error messages
   - Common errors:
     - `403 Forbidden`: Premium required
     - `401 Unauthorized`: Token/scope issue
     - `404 Not Found`: Endpoint issue

## 📝 Additional Resources

- [Spotify Web API Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)
- [NextAuth.js Spotify Provider](https://next-auth.js.org/providers/spotify)

## 🎉 Summary

**Your main issue is stale OAuth scopes.** The fix is simple:
1. Click "Force Re-Authentication" button
2. Sign in again
3. Grant all permissions
4. Verify scopes are present

This should resolve both the scope error AND the no devices issue.
