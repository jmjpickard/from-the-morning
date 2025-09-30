# Deployment Checklist - Web Player Integration

## Pre-Deployment Verification

### ✅ Code Quality
- [x] TypeScript compilation: No errors
- [x] All imports resolved correctly
- [x] No console errors in development
- [x] Proper error handling implemented
- [x] Cleanup functions in useEffect hooks

### ✅ Dependencies
- [x] `@types/spotify-web-playback-sdk` installed (v0.1.19)
- [x] No new production dependencies required
- [x] SDK loaded from CDN (no bundle size impact)

### ✅ Environment Configuration
- [x] OAuth scope includes `streaming`
- [x] HTTPS enabled (required for Web Playback SDK)
- [x] Spotify Developer App configured
- [ ] Production redirect URIs updated in Spotify Dashboard

## Deployment Steps

### 1. Environment Variables
Ensure these are set in production:
```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_BASE_URL=https://api.spotify.com/v1
```

### 2. Spotify Developer Dashboard
- [ ] Add production URL to Redirect URIs
  - Example: `https://yourdomain.com/api/auth/callback/spotify`
- [ ] Verify `streaming` scope is requested
- [ ] Test OAuth flow in production

### 3. Build and Deploy
```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate deploy

# Build the application
npm run build

# Start production server
npm start
```

### 4. DNS and SSL
- [ ] Domain configured with HTTPS
- [ ] SSL certificate valid
- [ ] No mixed content warnings

## Post-Deployment Testing

### Critical Path Testing
- [ ] User can log in with Spotify
- [ ] Web player initializes successfully
- [ ] Device appears in device list
- [ ] Music plays through browser
- [ ] Can switch between devices
- [ ] Player controls work (play, pause, skip, etc.)
- [ ] Volume control works
- [ ] Shuffle and repeat work

### Browser Testing
Test on these browsers:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

### Device Testing
- [ ] Desktop (Laptop/PC)
- [ ] Mobile (Phone)
- [ ] Tablet
- [ ] Multiple concurrent sessions

### Error Scenarios
- [ ] Non-Premium user gets helpful message
- [ ] Network interruption handled gracefully
- [ ] Token expiration handled
- [ ] Page refresh recovers properly
- [ ] Multiple tabs don't conflict

## Monitoring

### What to Monitor
- [ ] SDK load failures
- [ ] Player initialization errors
- [ ] Authentication errors
- [ ] Playback errors
- [ ] User agent distribution (browser types)

### Key Metrics
- SDK load time
- Player initialization time
- Playback success rate
- Device selection rate (web player vs. external)
- Error rates by type

### Logging
Ensure these are logged:
- Player initialization events
- Device selection events
- Playback errors
- Authentication errors
- SDK version/status

## Rollback Plan

### If Issues Occur

#### Quick Disable (No Code Change)
Not applicable - web player is additive, existing devices still work

#### Full Rollback
If necessary to revert changes:

```bash
# Remove the hook file
rm src/hooks/useSpotifyWebPlayback.ts

# Revert Player.tsx changes
git checkout HEAD~1 src/components/Player.tsx

# Revert DeviceSelectionDialog.tsx changes
git checkout HEAD~1 src/components/DeviceSelectionDialog.tsx

# Rebuild and redeploy
npm run build
```

#### Graceful Degradation
Web player is non-critical:
- Users can still use external devices
- App functions normally without web player
- Error handling prevents crashes

## Support Preparation

### User Communication
Prepare messaging about:
- New feature: Play directly in browser
- Requirement: Spotify Premium
- How to use: Automatic device selection
- Troubleshooting: See QUICK_START_GUIDE.md

### Support Team Training
Ensure support team knows:
- What the web player is
- How to identify web player issues
- Common troubleshooting steps
- When to escalate (rare SDK issues)

### FAQ Updates
Add to FAQ:
- "Why don't I see the web player?" → Spotify Premium required
- "How do I play on my current device?" → Automatic, or select from device list
- "Web player not appearing?" → Refresh page, check Premium status
- "Supported browsers?" → Chrome, Firefox, Safari, Edge

## Performance Benchmarks

### Expected Metrics
- SDK load: < 200ms (cached: < 50ms)
- Player initialization: 2-5 seconds
- Device appears: 5-8 seconds after page load
- Playback start: < 1 second after play command
- Memory usage: ~10-20MB additional

### Red Flags
- SDK load > 5 seconds → Check CDN
- Initialization > 10 seconds → Check Spotify API
- High error rate → Check logs
- High bounce rate → Check Premium requirement messaging

## Security Considerations

### Verified
- [x] OAuth 2.0 flow secure
- [x] Access tokens not exposed to client (passed via callback)
- [x] HTTPS required and enforced
- [x] No sensitive data in client-side code
- [x] SDK loaded from official Spotify CDN

### Post-Deployment
- [ ] Monitor for suspicious device creation patterns
- [ ] Rate limiting on device creation (if needed)
- [ ] Token refresh working properly
- [ ] No XSS vulnerabilities in device names

## Documentation

### Ensure Available
- [x] WEB_PLAYBACK_IMPLEMENTATION.md
- [x] DEVICE_PLAYBACK_FIX.md
- [x] QUICK_START_GUIDE.md
- [x] IMPLEMENTATION_SUMMARY.md
- [x] README.md updated
- [ ] Internal wiki updated (if applicable)
- [ ] Support docs updated

## Success Criteria

### Day 1
- [ ] No critical errors
- [ ] Web player appears for Premium users
- [ ] Playback works in tested browsers
- [ ] No complaints about existing device functionality

### Week 1
- [ ] Usage metrics collected
- [ ] User feedback gathered
- [ ] Performance metrics within expected range
- [ ] Support tickets minimal and resolvable

### Month 1
- [ ] Adoption rate measured
- [ ] Browser compatibility confirmed
- [ ] Performance optimized if needed
- [ ] Feature considered stable

## Contact Information

### Escalation Path
1. Check browser console for errors
2. Review server logs for API issues
3. Check Spotify Developer Dashboard for quota/limits
4. Contact Spotify support for SDK issues

### Resources
- Spotify Web Playback SDK: https://developer.spotify.com/documentation/web-playback-sdk
- Browser Support: https://developer.spotify.com/documentation/web-playback-sdk#browser-support
- Spotify Status Page: https://status.spotify.com/
- Developer Dashboard: https://developer.spotify.com/dashboard

## Final Pre-Deployment Checklist

- [x] All code changes committed
- [x] Documentation complete
- [x] TypeScript compilation successful
- [x] No linting errors
- [ ] Tested in production-like environment
- [ ] Spotify OAuth configured for production URLs
- [ ] HTTPS enabled
- [ ] Monitoring/logging configured
- [ ] Support team briefed
- [ ] Rollback plan documented
- [ ] Success metrics defined

---

**Ready for Deployment:** ✅ Code Complete  
**Pending:** Production testing and OAuth configuration  
**Risk Level:** Low (additive feature, graceful degradation)  
**Estimated Deployment Time:** 15-30 minutes