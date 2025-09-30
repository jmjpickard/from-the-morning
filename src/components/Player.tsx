import React, { useContext } from "react";
import { PlaybackState } from "~/types/playbackState";
import { api } from "~/utils/api";

interface Props {
  children?: React.ReactNode;
}

export interface PlaybackDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  volume_percent: number;
}

interface SpotifyContextPayload {
  accessToken?: string;
  playerState?: string;
  currentTrack?: string;
  devices?: PlaybackDevice[];
  activeDevice?: PlaybackDevice;
  setActiveDevice: (deviceId: string) => void;
  setActiveIsLoading: boolean;
  play: (trackId: string) => void;
  pause: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetchPlayback: () => Promise<any>;
  playbackState?: PlaybackState | null;
  // Queue / playlist support
  queue?: string[];
  queueIndex?: number | null;
  setQueue: (uris: string[], startIndex?: number) => void;
  playFromQueue: (index: number) => void;
  next: () => void;
  prev: () => void;
  // Native Spotify controls
  skipNext: () => void;
  skipPrevious: () => void;
  seek: (positionMs: number) => void;
  setVolume: (volumePercent: number) => void;
  toggleShuffle: (state: boolean) => void;
  setRepeat: (state: "track" | "context" | "off") => void;
  addToQueue: (uri: string) => void;
  // Device selection helpers
  hasActiveDevice: boolean;
  needsDeviceSelection: boolean;
}

const SpotifyContext = React.createContext<SpotifyContextPayload | undefined>(
  undefined,
);

export const SpotifyPlayer: React.FC<Props> = ({ children }) => {
  const [playerState, setPlayerState] = React.useState<string | undefined>();
  const [currentTrack, setCurrentTrack] = React.useState<string | undefined>();
  const [queueUris, setQueueUris] = React.useState<string[]>([]);
  const [queueIndex, setQueueIndex] = React.useState<number | null>(null);
  const lastAdvancedFromTrackUri = React.useRef<string | null>(null);

  const { data: token } = api.user.getAccessToken.useQuery();

  const { data: devices, refetch } = api.player.getDevices.useQuery(
    { accessToken: token ?? "" },
    {
      enabled: !!token,
    },
  );

  const { data: playback, refetch: refetchPlayback } =
    api.player.getCurrentPlaybackState.useQuery(
      {
        accessToken: token ?? "",
      },
      {
        enabled: !!token,
        refetchInterval: 2000,
      },
    );

  const transferPlayback = api.player.transferPlayback.useMutation({
    onSuccess: () => refetch(),
  });
  const playTrack = api.player.playTrack.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const pauseTrack = api.player.pauseTrack.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const skipNextMutation = api.player.skipNext.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const skipPreviousMutation = api.player.skipPrevious.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const seekMutation = api.player.seek.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const setVolumeMutation = api.player.setVolume.useMutation();
  const toggleShuffleMutation = api.player.toggleShuffle.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const setRepeatMutation = api.player.setRepeat.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const addToQueueMutation = api.player.addToQueue.useMutation();

  const pause = () => {
    pauseTrack.mutate({ accessToken: token ?? "" });
  };

  const activeDevice: PlaybackDevice | undefined = devices?.find(
    (d: PlaybackDevice) => d.is_active,
  );

  const hasActiveDevice = !!activeDevice;
  const needsDeviceSelection = !hasActiveDevice && (devices?.length ?? 0) > 0;

  const play = (trackUrl: string) => {
    // Only play if we have an active device
    if (!activeDevice) {
      console.warn("No active device - cannot play track");
      return;
    }
    console.log("play");
    playTrack.mutate({
      accessToken: token ?? "",
      trackUrl,
      deviceId: activeDevice.id,
    });
  };

  const setActiveDevice = (deviceId: string) => {
    transferPlayback.mutate({ accessToken: token ?? "", deviceId });
  };

  const setQueue = (uris: string[], startIndex = 0) => {
    setQueueUris(uris);
    setQueueIndex(startIndex);
  };

  const playFromQueue = (index: number) => {
    if (!queueUris.length) return;
    const clampedIndex = Math.max(0, Math.min(index, queueUris.length - 1));
    setQueueIndex(clampedIndex);
    const targetUri = queueUris[clampedIndex];
    if (targetUri) {
      play(targetUri);
    }
  };

  const next = () => {
    if (queueIndex === null) return;
    const nextIndex = queueIndex + 1;
    if (nextIndex < queueUris.length) {
      playFromQueue(nextIndex);
    }
  };

  const prev = () => {
    if (queueIndex === null) return;
    const prevIndex = queueIndex - 1;
    if (prevIndex >= 0) {
      playFromQueue(prevIndex);
    }
  };

  // Native Spotify controls
  const skipNext = () => {
    skipNextMutation.mutate({
      accessToken: token ?? "",
      deviceId: activeDevice?.id,
    });
  };

  const skipPrevious = () => {
    skipPreviousMutation.mutate({
      accessToken: token ?? "",
      deviceId: activeDevice?.id,
    });
  };

  const seek = (positionMs: number) => {
    seekMutation.mutate({
      accessToken: token ?? "",
      positionMs,
      deviceId: activeDevice?.id,
    });
  };

  const setVolume = (volumePercent: number) => {
    setVolumeMutation.mutate({
      accessToken: token ?? "",
      volumePercent,
      deviceId: activeDevice?.id,
    });
  };

  const toggleShuffleControl = (state: boolean) => {
    toggleShuffleMutation.mutate({
      accessToken: token ?? "",
      state,
      deviceId: activeDevice?.id,
    });
  };

  const setRepeatControl = (state: "track" | "context" | "off") => {
    setRepeatMutation.mutate({
      accessToken: token ?? "",
      state,
      deviceId: activeDevice?.id,
    });
  };

  const addToQueueControl = (uri: string) => {
    addToQueueMutation.mutate({
      accessToken: token ?? "",
      uri,
      deviceId: activeDevice?.id,
    });
  };

  React.useEffect(() => {
    const currentUri = playback?.item?.uri;
    const durationMs = playback?.item?.duration_ms ?? 0;
    const progressMs = playback?.progress_ms ?? 0;
    const remainingMs = durationMs - progressMs;

    const isManagingQueue = queueIndex !== null && queueUris.length > 0;
    const isCurrentQueuedTrack =
      isManagingQueue && currentUri === queueUris[queueIndex ?? 0];

    // Auto-advance when near the end of the current queued track
    if (
      isCurrentQueuedTrack &&
      playback?.is_playing &&
      remainingMs <= 1000 &&
      lastAdvancedFromTrackUri.current !== currentUri
    ) {
      lastAdvancedFromTrackUri.current = currentUri ?? null;
      next();
    }

    // Reset the guard when the track changes and playback restarted
    if (currentUri && currentUri !== lastAdvancedFromTrackUri.current && progressMs < 1000) {
      // Allow future auto-advance for this track
      // Intentionally no-op besides the check; the guard will be compared again at end-of-track
    }
  }, [playback?.item?.uri, playback?.progress_ms, playback?.is_playing, queueIndex, queueUris]);

  return (
    <SpotifyContext.Provider
      value={{
        accessToken: token,
        playerState,
        currentTrack,
        devices,
        activeDevice,
        setActiveDevice,
        setActiveIsLoading: transferPlayback.isLoading,
        play,
        pause,
        refetchPlayback,
        playbackState: playback,
        queue: queueUris,
        queueIndex,
        setQueue,
        playFromQueue,
        next,
        prev,
        skipNext,
        skipPrevious,
        seek,
        setVolume,
        toggleShuffle: toggleShuffleControl,
        setRepeat: setRepeatControl,
        addToQueue: addToQueueControl,
        hasActiveDevice,
        needsDeviceSelection,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);
