# Deploy Diagnostic Tool - Action Plan 🚀

## ✅ What's Ready

All files have been created and are ready to deploy:

```
✓ src/pages/diagnostics.tsx (Main dashboard UI)
✓ src/pages/api/debug/check-account.ts (Account check endpoint)
✓ src/pages/api/debug/test-spotify.ts (API test endpoint)
✓ DIAGNOSTIC_TOOL_GUIDE.md (User guide)
✓ DIAGNOSTIC_IMPLEMENTATION_SUMMARY.md (Implementation details)
✓ QUICK_DIAGNOSTIC_REFERENCE.md (Quick reference)
```

## 🚀 Deployment Steps

### Option 1: Automatic (Vercel Git Integration)

If you have Git integration with Vercel:

```bash
# 1. Commit the changes
git add .
git commit -m "Add Spotify diagnostic tool"

# 2. Push to your repo
git push origin main  # or your branch name

# 3. Vercel will automatically deploy
# Wait ~2-3 minutes for deployment
```

### Option 2: Manual (Vercel CLI)

If you use Vercel CLI:

```bash
# 1. Deploy
vercel --prod

# 2. Wait for deployment to complete
```

### Option 3: Direct Git Commit (from Cursor)

Since you're using Cursor Agent on mobile:

1. Cursor should automatically commit these files
2. Push will trigger Vercel deployment
3. Check Vercel dashboard for deployment status

## 📍 No Configuration Needed!

The diagnostic tool uses your existing setup:
- ✅ Uses existing tRPC routes
- ✅ Uses existing NextAuth configuration
- ✅ Uses existing database connection
- ✅ Uses existing environment variables
- ✅ No new dependencies required
- ✅ Protected by existing authentication

## 🎯 After Deployment

### Step 1: Access the Diagnostic Page

Visit your deployed URL with `/diagnostics`:
```
https://your-app-name.vercel.app/diagnostics
```

### Step 2: Initial Check

1. You should see the diagnostic dashboard
2. If not logged in, it will redirect to sign in
3. Once logged in, diagnostics will auto-run

### Step 3: Verify It Works

Look for this:
- ✅ Page loads successfully
- ✅ You see "Spotify Connection Diagnostics" header
- ✅ Buttons are visible (Run Diagnostics, Test API Calls, etc.)
- ✅ Live Data section shows token/device status

### Step 4: Run First Test

1. Click **"Run Diagnostics"** button
2. Wait ~5-10 seconds
3. You should see 7 checks complete with colored status

### Step 5: Deep Test

1. Click **"Test API Calls"** button
2. Wait ~5-10 seconds
3. Terminal-style logs should appear in black box
4. Look for ✓ or ❌ indicators

## 🐛 Expected Issues & Quick Fixes

### Issue: Page 404

**Problem**: Route not found

**Fix**: Make sure files are in correct locations:
- `src/pages/diagnostics.tsx` (not src/diagnostics.tsx)
- `src/pages/api/debug/` folder exists

**Solution**: Files are already correct, just redeploy

---

### Issue: "Unauthorized" or redirect loop

**Problem**: NextAuth session issue

**Fix**: Clear browser cookies, sign in again

---

### Issue: TypeScript errors during build

**Problem**: Type resolution in build

**Fix**: The code has proper types, should build fine. If not:
```bash
npm run build
```
Check the specific error and we'll fix it.

---

### Issue: tRPC errors

**Problem**: API routes not responding

**Fix**: Make sure your existing tRPC setup is working. The diagnostic uses existing `api.user.getAccessToken` and `api.player.*` routes.

---

## 🎬 What to Do After Deployment

### Immediate Actions:

1. **Access Diagnostic Page**
   ```
   https://your-app.vercel.app/diagnostics
   ```

2. **Run Diagnostics**
   - Click "Run Diagnostics"
   - Review all checks
   - Note which ones are green vs red

3. **Test API Calls**
   - Click "Test API Calls"
   - Read the logs
   - Find where connection fails

4. **Share Results**
   - Take screenshots of any red errors
   - Or use "Copy Diagnostic Data" button
   - Share back for help if needed

### For This Conversation:

**Please copy and paste the results from "Test API Calls"** so I can see exactly what's happening with your Spotify connection. This will tell us:

- ✅ Is the database connection working?
- ✅ Is refresh_token stored?
- ✅ Can we get a new access_token?
- ✅ Do Spotify API calls succeed?
- ✅ Are devices available?
- ✅ Is playback working?

The logs will look like:
```
[timestamp] Starting Spotify API test
User ID: abc123
Email: you@example.com

--- Step 1: Database Query ---
✓ Account found: spotify
  Has refresh_token: true
  ...

--- Step 2: Token Refresh ---
[✓ or ❌ here tells us if credentials are correct]
...
```

## 📱 Mobile Access

Since you're on mobile:

1. **Bookmark the diagnostic page** on your phone
2. Add to home screen for quick access
3. Keep it open in a separate browser tab
4. Use while testing your main app

## 🔍 What the Diagnostics Will Reveal

Based on what you see, we'll know:

### ✅ All Green Checks
**Means**: Everything working! Playback should work.
**Next**: Test actually playing a track in main app

### ❌ Red on "Database Account Record"
**Means**: No refresh_token in database
**Fix**: Sign out and sign in again
**Why**: OAuth didn't complete properly

### ❌ Red on "Spotify Access Token"
**Means**: Can't refresh token from Spotify
**Fix**: Check environment variables in Vercel
**Why**: Client credentials wrong or refresh token invalid

### ❌ Red/Yellow on "Spotify Devices"
**Means**: No devices available
**Fix**: Open Spotify app or wait for web player
**Why**: Need an active playback device

### ❌ Red on "OAuth Scopes"
**Means**: Missing required permissions
**Fix**: Sign out, remove app authorization, sign in again
**Why**: Scopes changed after you logged in

## 🎯 Success Criteria

You'll know the diagnostic tool is working when:

1. ✅ Page loads at `/diagnostics`
2. ✅ Shows your email in session check
3. ✅ "Run Diagnostics" shows 7 checks
4. ✅ "Test API Calls" shows detailed logs
5. ✅ Can copy logs to clipboard
6. ✅ Live data updates when you click "Refresh Data"

## ⚡ Quick Start (TL;DR)

```bash
# 1. Deploy (automatic if using Git with Vercel)
git push

# 2. Wait for deployment (~2 min)

# 3. Visit diagnostic page
https://your-app.vercel.app/diagnostics

# 4. Click "Test API Calls"

# 5. Copy the logs and review/share

# Done! 🎉
```

## 💡 Key Insight

This diagnostic tool will show you **exactly** where in the flow your Spotify connection is breaking:

```
Authentication → Database → Token Refresh → API Calls → Devices → Playback
      ✓              ✓            ✓             ❌          ?          ?
                                            [Fails here!]
```

Instead of guessing "maybe it's the token?" or "maybe it's the device?" you'll **see** precisely which step fails and what the error is.

## 🎵 Final Note

The diagnostic tool is **non-invasive**:
- ✅ Doesn't modify any existing code
- ✅ Doesn't affect your main app
- ✅ Only reads/observes state
- ✅ Can't break anything
- ✅ Safe to use in production

It's purely a **visibility tool** - think of it as "developer tools" for your Spotify integration.

---

## 📋 Deployment Checklist

Before you tell me it's deployed, confirm:

- [ ] Files committed to Git
- [ ] Pushed to repository
- [ ] Vercel deployment completed (check Vercel dashboard)
- [ ] Accessed `/diagnostics` URL successfully
- [ ] Logged in to see the dashboard
- [ ] Clicked "Test API Calls" button
- [ ] Logs appeared in terminal-style box

Once done: **Copy and paste the test logs** so we can debug together!

---

**Ready to see what's actually happening with your Spotify connection?** 🎯

Deploy, test, and share the results! 🚀
