# Quick Diagnostic Reference Card 🎵

## 🚀 Instant Access
```
https://your-app.vercel.app/diagnostics
```

## 🎯 Three-Button Solution

| Button | When to Use | What It Does |
|--------|-------------|--------------|
| **Run Diagnostics** | First check / After changes | Runs 7 automated checks |
| **Test API Calls** | Deep debugging | Server-side Spotify API test |
| **Refresh Data** | Quick update | Refreshes devices & playback |

## 🚦 Status Colors at a Glance

- 🟢 = Working
- 🟡 = Warning (not critical)
- 🔴 = Broken (fix this!)
- 🔵 = Loading

## 🔥 Quick Fixes

### ❌ No Refresh Token
```
1. Sign out
2. Sign in again
✅ Done
```

### ❌ No Devices
```
1. Open Spotify app
2. Play any song
3. Wait 10 seconds
✅ Done
```

### ❌ Token Refresh Failed
```
1. Go to Vercel Dashboard
2. Check Environment Variables:
   - SPOTIFY_CLIENT_ID
   - SPOTIFY_CLIENT_SECRET
   - NEXTAUTH_SECRET
3. Redeploy if changed
✅ Done
```

### ❌ Missing Scopes
```
1. Visit spotify.com/account/apps
2. Remove your app
3. Sign in to your app again
✅ Done
```

## 📋 Copy This Checklist

When reporting issues, copy & paste this:

```
[ ] Ran "Run Diagnostics" - all checks shown
[ ] Ran "Test API Calls" - logs captured
[ ] Checked Vercel env vars exist
[ ] Tried signing out and back in
[ ] Opened Spotify app on another device
[ ] Copied diagnostic data from "📋 Copy Diagnostic Data"

Logs:
[Paste here]
```

## 🎯 Most Common Issue (90% of cases)

```
Problem: Refresh token missing from database
Symptom: Red X on "Database Account Record"
Fix: Sign out → Sign in → Check again
Time: 30 seconds
```

## 📱 Mobile Tips

1. Bookmark `/diagnostics`
2. Screenshot errors immediately
3. Use "Copy Logs" button (easier than typing)
4. Keep diagnostics open in separate tab
5. Enable auto-refresh for monitoring

## 🔍 Reading Test Logs

```
✓ = Success (good!)
❌ = Failed (problem here!)
⚠️ = Warning (might be normal)
ℹ️ = Info (just FYI)
```

## ⚡ Speed Run (30 seconds)

```
1. Open /diagnostics
2. Click "Test API Calls"
3. Look for first ❌
4. That's your problem!
```

## 🎵 Working State Template

Save this for comparison:
```
✓ Session: Authenticated
✓ Account: refresh_token present
✓ Token: Retrieved
✓ Devices: 2 found
✓ Active Device: [name]
✓ Playback: Playing
✓ SDK: Loaded
```

## 🆘 Emergency Checklist

Start from top, stop when you find ❌:

1. [ ] Can access `/diagnostics`?
2. [ ] Session authenticated?
3. [ ] Database has account?
4. [ ] Has refresh_token?
5. [ ] Token refresh works?
6. [ ] Devices found?
7. [ ] Active device selected?

**First ❌ = Your issue!**

## 🎁 Bonus: One-Liner Diagnosis

**Copy this to your notes app:**
```
Token: [Valid/Missing] | Devices: [X] | Active: [Yes/No] | Playback: [Working/Not]
```

Update it each time you check!

---

**Remember:** The diagnostic tool shows you **exactly** what's broken. No guessing! 🎯
