# Diagnostic Tool - Visual Flow Guide 🎨

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR SPOTIFY PROBLEM                      │
│  "Playback not working, can't debug on mobile"              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   THE DIAGNOSTIC TOOL                        │
│  Shows exactly what's broken and where                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     CLEAR SOLUTION                           │
│  Know exactly what to fix                                   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 What You'll See

### Main Dashboard View

```
┌─────────────────────────────────────────────────────────┐
│  Spotify Connection Diagnostics                         │
│  Real-time debugging dashboard                          │
│                                                          │
│  [Run Diagnostics] [Refresh Data] [Test API Calls]     │
│  □ Auto-refresh (3s)                                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Token Status: ✓ Valid                            │  │
│  │ Devices: 2 found                                 │  │
│  │ Active Device: From The Morning Web Player       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  🎵 Currently Playing:                                  │
│  Song Name                                              │
│  Artist Name                                            │
│  ▶️ Playing on Device Name                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### After Clicking "Run Diagnostics"

```
┌─────────────────────────────────────────────────────────┐
│ Diagnostic Checks                                        │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  NextAuth Session              [10:23:45]      │   │
│ │    Authenticated as user@email.com               │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  Database Account Record       [10:23:46]      │   │
│ │    Account found with refresh token              │   │
│ │    ▶ View Details                                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  Spotify Access Token          [10:23:47]      │   │
│ │    Token retrieved successfully                  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  Spotify Devices               [10:23:48]      │   │
│ │    Found 2 device(s)                             │   │
│ │    ▶ View Details                                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  Current Playback State        [10:23:49]      │   │
│ │    Playing                                       │   │
│ │    ▶ View Details                                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ✓  Web Playback SDK              [10:23:50]      │   │
│ │    SDK loaded                                    │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### After Clicking "Test API Calls"

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Spotify API Test Results                             │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ [2025-09-30T10:24:15.000Z] Starting test...      │   │
│ │ User ID: abc123                                  │   │
│ │ Email: user@email.com                            │   │
│ │                                                  │   │
│ │ --- Step 1: Database Query ---                  │   │
│ │ ✓ Account found: spotify                        │   │
│ │   Has refresh_token: true                       │   │
│ │   Scopes: user-read-email streaming...          │   │
│ │                                                  │   │
│ │ --- Step 2: Token Refresh ---                   │   │
│ │ ✓ Access token obtained: BQDrx...               │   │
│ │                                                  │   │
│ │ --- Step 3: Test Spotify API ---                │   │
│ │ Status: 200 OK                                  │   │
│ │ ✓ Successfully authenticated as: UserName        │   │
│ │   Product: premium                              │   │
│ │                                                  │   │
│ │ --- Step 4: Test Get Devices ---                │   │
│ │ Status: 200 OK                                  │   │
│ │ ✓ Devices fetched successfully                  │   │
│ │   Device count: 2                               │   │
│ │   [1] iPhone (Smartphone) - Active: false       │   │
│ │   [2] Web Player (Computer) - Active: true      │   │
│ │                                                  │   │
│ │ --- Step 5: Test Current Playback ---           │   │
│ │ Status: 200 OK                                  │   │
│ │ ✓ Playback state fetched                        │   │
│ │   Playing: true                                 │   │
│ │   Track: Song Name                              │   │
│ │   Artist: Artist Name                           │   │
│ │   Device: Web Player                            │   │
│ │                                                  │   │
│ │ --- Test Complete ---                           │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ [📋 Copy Logs]                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🚦 Color Coding

### Green (Success) ✅
```
┌──────────────────────────────────────┐
│ ✓  Check Name                        │
│    Everything is working             │
└──────────────────────────────────────┘
```
**Action**: Nothing needed, this is good!

### Yellow (Warning) ⚠️
```
┌──────────────────────────────────────┐
│ ⚠  Check Name                        │
│    Not critical but needs attention  │
└──────────────────────────────────────┘
```
**Action**: Review details, might need fixing

### Red (Error) ❌
```
┌──────────────────────────────────────┐
│ ✕  Check Name                        │
│    This is blocking functionality    │
└──────────────────────────────────────┘
```
**Action**: Fix this immediately!

### Blue (Pending) ⏳
```
┌──────────────────────────────────────┐
│ ⏳  Check Name                        │
│    Still loading...                  │
└──────────────────────────────────────┘
```
**Action**: Wait for it to complete

## 🔍 The Diagnostic Flow

```
User visits /diagnostics
        ↓
┌─────────────────┐
│ Is user logged  │
│ in?             │
└─────────────────┘
        ↓ No
    [Redirect to signin]
        ↓ Yes
┌─────────────────┐
│ Show dashboard  │
│ Auto-run checks │
└─────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Run 7 Automated Checks                  │
│                                         │
│ 1. Session ✓                            │
│ 2. Database Account ✓                   │
│ 3. OAuth Scopes ✓                       │
│ 4. Access Token ✓                       │
│ 5. Spotify Devices ✓                    │
│ 6. Current Playback ✓                   │
│ 7. Web SDK ✓                            │
└─────────────────────────────────────────┘
        ↓
   [All green?]
        ↓ Yes
    ✅ Working!
        ↓ No
    ❌ Fix the red ones
```

## 🔬 Deep Dive with Test API Calls

```
User clicks "Test API Calls"
        ↓
┌────────────────────────┐
│ Server-Side Test       │
│ (API Route)            │
└────────────────────────┘
        ↓
Step 1: Database
├─ Query Account table
├─ Check refresh_token exists
└─ [✓/❌] Result
        ↓
Step 2: Token Refresh
├─ POST to Spotify token endpoint
├─ Use client_id + client_secret
├─ Exchange refresh_token
└─ [✓/❌] Get access_token
        ↓
Step 3: Test User API
├─ GET /me
├─ Verify token works
└─ [✓/❌] User data returned
        ↓
Step 4: Test Devices
├─ GET /me/player/devices
├─ List available devices
└─ [✓/❌] Device list returned
        ↓
Step 5: Test Playback
├─ GET /me/player
├─ Current playback state
└─ [✓/❌] Playback data returned
        ↓
┌────────────────────────┐
│ Return detailed logs   │
│ to client              │
└────────────────────────┘
        ↓
┌────────────────────────┐
│ Display in terminal    │
│ style UI               │
└────────────────────────┘
```

## 🎯 Common Failure Patterns

### Pattern 1: Token Issue
```
Step 1: Database          ✓
Step 2: Token Refresh     ❌ ← Fails here
Step 3: Test User API     ⏸️  (skipped)
Step 4: Test Devices      ⏸️  (skipped)
Step 5: Test Playback     ⏸️  (skipped)

Problem: Can't refresh token
Cause: Wrong client credentials or expired refresh token
Fix: Check Vercel env vars or re-authenticate
```

### Pattern 2: Scope Issue
```
Step 1: Database          ✓
Step 2: Token Refresh     ✓
Step 3: Test User API     ✓
Step 4: Test Devices      ❌ ← Fails here (403 Forbidden)
Step 5: Test Playback     ⏸️  (might fail too)

Problem: Missing scopes
Cause: User didn't grant all required permissions
Fix: Sign out, remove app auth, sign in again
```

### Pattern 3: No Devices
```
Step 1: Database          ✓
Step 2: Token Refresh     ✓
Step 3: Test User API     ✓
Step 4: Test Devices      ✓ (but device count: 0)
Step 5: Test Playback     ✓ (204 No Content)

Problem: No active devices
Cause: No Spotify app open, web player not initialized
Fix: Open Spotify app or wait for web player
```

### Pattern 4: Database Issue
```
Step 1: Database          ❌ ← Fails here
Step 2: Token Refresh     ⏸️  (can't proceed)
Step 3: Test User API     ⏸️  (can't proceed)
Step 4: Test Devices      ⏸️  (can't proceed)
Step 5: Test Playback     ⏸️  (can't proceed)

Problem: No account in database
Cause: User never signed in with Spotify OAuth
Fix: Sign in with Spotify
```

## 📱 Mobile View

```
┌─────────────────────────────┐
│ 📱 iPhone/Android           │
│                             │
│ ┌─────────────────────────┐ │
│ │ Spotify Diagnostics     │ │
│ │                         │ │
│ │ [Run Diagnostics]       │ │
│ │ [Refresh Data]          │ │
│ │ [Test API]              │ │
│ │ □ Auto-refresh          │ │
│ │                         │ │
│ │ Token: ✓ Valid          │ │
│ │ Devices: 2              │ │
│ │ Active: Web Player      │ │
│ │                         │ │
│ │ ✓ Session OK            │ │
│ │ ✓ Token OK              │ │
│ │ ✓ Devices OK            │ │
│ │ ✓ Playback OK           │ │
│ │                         │ │
│ │ [Scroll for more]       │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

## 🎨 Real Example: Broken vs Fixed

### BEFORE (Broken State)
```
┌──────────────────────────────────┐
│ ✓  Session                       │
│    Authenticated                 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ❌  Database Account             │
│    No refresh token found        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ❌  Access Token                 │
│    Token is undefined            │
└──────────────────────────────────┘

[Everything else fails because no token]
```

**Problem visible**: No refresh token in database!

### AFTER (Fixed)
```
┌──────────────────────────────────┐
│ ✓  Session                       │
│    Authenticated                 │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ✓  Database Account              │
│    Account found with token      │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ✓  Access Token                  │
│    Token retrieved successfully  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ✓  Spotify Devices               │
│    Found 2 devices               │
└──────────────────────────────────┘

[Everything green! 🎉]
```

**Action taken**: Signed out and signed in again

## 🎵 Summary

```
                Before                    After
                ------                    -----
    You: "It's not working"    You: "Step 2 fails with 400"
     Us: "Try everything?"      Us: "Fix client_id in Vercel"
   Time: Hours of guessing      Time: 2 minutes to fix
Result: Still broken maybe     Result: Fixed! ✅
```

The diagnostic tool gives you **X-ray vision** into your Spotify integration! 🔍✨

---

**Ready to see inside?** Deploy and visit `/diagnostics`! 🚀
