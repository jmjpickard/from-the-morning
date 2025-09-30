# Web Playback SDK Implementation

## Overview

This implementation adds Spotify's Web Playback SDK to enable music playback directly in the browser, whether on a phone, laptop, or tablet. Users no longer need to have the Spotify app open on their device - they can play music directly through the web browser.

## Changes Made

### 1. New Hook: `useSpotifyWebPlayback.ts`

Created a custom React hook that manages the Spotify Web Playback SDK lifecycle:

- **SDK Loading**: Dynamically loads the Spotify Web Playback SDK script
- **Player Initialization**: Creates a web player instance with the name "From The Morning Web Player"
- **Error Handling**: Comprehensive error listeners for initialization, authentication, account, and playback errors
- **Device Management**: Tracks device ID and ready state
- **Event Handling**: Listens to player state changes and notifies parent components

**Key Features:**
- Automatically loads SDK script when needed
- Prevents duplicate player instances
- Provides callbacks for player ready and state changes
- Handles cleanup when component unmounts

### 2. Updated Player Component

Enhanced the `Player.tsx` component to integrate the Web Playback SDK:

- **Web Player Integration**: Initializes the web player using the `useSpotifyWebPlayback` hook
- **Auto-Selection**: Automatically selects the web player as the active device when it becomes ready (if no other device is active)
- **Device List Refresh**: Refreshes the device list when the web player becomes ready to ensure it appears in the list

### 3. Enhanced Device Selection Dialog

Updated `DeviceSelectionDialog.tsx` to improve the UX for web player selection:

- **Visual Distinction**: Added `MonitorSpeakerIcon` for the web player device
- **Smart Sorting**: Devices are sorted to show:
  1. Web player first (marked as "This Browser")
  2. Active devices
  3. Other devices
- **Improved Messaging**: Updated descriptions to explain that the web player allows playing directly in the browser
- **Better Empty State**: Updated the "no devices" message to indicate the web player is loading

## User Experience

### Before
- Users needed to have Spotify open on another device
- On mobile, the phone's Spotify app wouldn't appear as a device when browsing from the browser
- Required switching between apps or devices

### After
- The browser itself becomes a playback device
- Works on any device: phone, laptop, tablet
- No need to have Spotify app running
- Clear indication: "From The Morning Web Player (This Browser)"
- Automatically selected when ready

## Technical Details

### Spotify Web Playback SDK

The Web Playback SDK allows web applications to:
- Create a device that appears in Spotify Connect
- Play Spotify tracks through the Web Playback API
- Control playback (play, pause, skip, volume, etc.)
- Receive playback state updates

### Requirements

1. **Premium Account**: Spotify Web Playback SDK requires a Spotify Premium account
2. **HTTPS**: The SDK requires a secure context (HTTPS)
3. **Scopes**: The `streaming` scope is required (already included in auth configuration)

### Browser Support

The Spotify Web Playback SDK supports:
- Chrome (Desktop & Android)
- Firefox (Desktop & Android)
- Edge (Desktop)
- Safari (Desktop & iOS)
- Opera (Desktop)

## Implementation Notes

### Security & Best Practices

1. **Token Management**: Access token is passed securely through the `getOAuthToken` callback
2. **Instance Management**: Uses `useRef` to prevent duplicate player instances
3. **Cleanup**: Properly disconnects player on component unmount
4. **Error Handling**: Comprehensive error listeners with user-friendly messages

### Performance

1. **Lazy Loading**: SDK script is loaded dynamically, not blocking initial page load
2. **Single Instance**: Only one player instance is created per session
3. **Efficient Updates**: State changes trigger minimal re-renders

### Integration with Existing Code

The implementation seamlessly integrates with the existing player infrastructure:
- Uses the same device transfer API
- Works with existing playback controls
- Maintains compatibility with external Spotify devices
- No breaking changes to existing functionality

## Testing Recommendations

1. **Desktop Browser**: Test on Chrome, Firefox, Safari, Edge
2. **Mobile Browser**: Test on iOS Safari and Android Chrome
3. **Device Switching**: Verify seamless switching between web player and external devices
4. **Playback Controls**: Test play, pause, skip, volume, shuffle, repeat
5. **Queue Management**: Verify queue functionality works with web player
6. **Error Scenarios**: Test with non-Premium accounts, network issues

## Future Enhancements

Possible improvements:
1. **Visual Player UI**: Show album art, track progress bar directly on web player
2. **Offline Support**: Cache recently played tracks for offline playback
3. **Audio Visualizer**: Add visual feedback during playback
4. **Custom Device Name**: Allow users to name their web player device
5. **Multi-Room**: Support multiple browser instances for multi-room playback

## Troubleshooting

### Web Player Not Appearing
- Ensure user has Spotify Premium
- Check browser console for SDK errors
- Verify `streaming` scope is included in OAuth
- Confirm HTTPS is being used

### Playback Issues
- Check network connectivity
- Verify access token is valid
- Look for playback_error events in console
- Try refreshing the device list

### Audio Quality
- Depends on network bandwidth
- SDK automatically adjusts quality
- Premium users get high-quality streams

## References

- [Spotify Web Playback SDK Documentation](https://developer.spotify.com/documentation/web-playback-sdk)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api)
- [TypeScript Types for Web Playback SDK](https://www.npmjs.com/package/@types/spotify-web-playback-sdk)