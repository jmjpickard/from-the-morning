import { useEffect, useState, useRef } from "react";

interface UseSpotifyWebPlaybackProps {
  accessToken: string | undefined;
  onPlayerReady?: (deviceId: string) => void;
  onPlayerStateChanged?: (state: Spotify.PlaybackState | null) => void;
}

interface UseSpotifyWebPlaybackReturn {
  player: Spotify.Player | null;
  deviceId: string | null;
  isReady: boolean;
  error: string | null;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

export const useSpotifyWebPlayback = ({
  accessToken,
  onPlayerReady,
  onPlayerStateChanged,
}: UseSpotifyWebPlaybackProps): UseSpotifyWebPlaybackReturn => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const playerRef = useRef<Spotify.Player | null>(null);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if SDK is already loaded
    if (window.Spotify) {
      setSdkLoaded(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]',
    );
    if (existingScript) {
      // Script is loading, wait for it
      window.onSpotifyWebPlaybackSDKReady = () => {
        setSdkLoaded(true);
      };
      return;
    }

    // Load the SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setSdkLoaded(true);
    };

    return () => {
      // Cleanup function - don't remove script as it's shared
    };
  }, []);

  // Initialize player when SDK is loaded and we have an access token
  useEffect(() => {
    if (!sdkLoaded || !accessToken || !window.Spotify) {
      return;
    }

    // Don't create a new player if one already exists
    if (playerRef.current) {
      return;
    }

    const spotifyPlayer = new window.Spotify.Player({
      name: "From The Morning Web Player",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(accessToken);
      },
      volume: 0.5,
    });

    // Error handling
    spotifyPlayer.addListener("initialization_error", ({ message }: { message: string }) => {
      console.error("Initialization error:", message);
      setError(`Initialization error: ${message}`);
    });

    spotifyPlayer.addListener("authentication_error", ({ message }: { message: string }) => {
      console.error("Authentication error:", message);
      setError(`Authentication error: ${message}`);
    });

    spotifyPlayer.addListener("account_error", ({ message }: { message: string }) => {
      console.error("Account error:", message);
      setError(`Account error: ${message}`);
    });

    spotifyPlayer.addListener("playback_error", ({ message }: { message: string }) => {
      console.error("Playback error:", message);
      setError(`Playback error: ${message}`);
    });

    // Ready
    spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
      console.log("Ready with Device ID", device_id);
      setDeviceId(device_id);
      setIsReady(true);
      setError(null);
      onPlayerReady?.(device_id);
    });

    // Not Ready
    spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
      console.log("Device ID has gone offline", device_id);
      setIsReady(false);
    });

    // Player state changed
    spotifyPlayer.addListener("player_state_changed", (state: Spotify.PlaybackState | null) => {
      console.log("Player state changed:", state);
      onPlayerStateChanged?.(state);
    });

    // Connect to the player
    spotifyPlayer.connect().then((success: boolean) => {
      if (success) {
        console.log("The Web Playback SDK successfully connected to Spotify!");
      } else {
        console.error("The Web Playback SDK could not connect to Spotify");
        setError("Could not connect to Spotify");
      }
    }).catch((err: unknown) => {
      console.error("Error connecting to Spotify:", err);
      setError("Error connecting to Spotify");
    });

    playerRef.current = spotifyPlayer;
    setPlayer(spotifyPlayer);

    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [sdkLoaded, accessToken, onPlayerReady, onPlayerStateChanged]);

  return {
    player,
    deviceId,
    isReady,
    error,
  };
};