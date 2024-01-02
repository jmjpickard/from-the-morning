import React, { useContext } from "react";
import { PlaybackState } from "~/types/playbackState";
import { api } from "~/utils/api";

interface Props {
  children?: JSX.Element | string;
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
  refetchPlayback: () => void;
  playbackState?: PlaybackState | null;
}

const SpotifyContext = React.createContext<SpotifyContextPayload | undefined>(
  undefined,
);

export const SpotifyPlayer: React.FC<Props> = ({ children }) => {
  const [playerState, setPlayerState] = React.useState<string | undefined>();
  const [currentTrack, setCurrentTrack] = React.useState<string | undefined>();

  const { data: token } = api.user.getAccessToken.useQuery();

  const { data: devices, refetch } = api.player.getDevices.useQuery(
    { accessToken: token || "" },
    {
      enabled: !!token,
    },
  );

  const { data: playback, refetch: refetchPlayback } =
    api.player.getCurrentPlaybackState.useQuery({
      accessToken: token || "",
    });

  const transferPlayback = api.player.transferPlayback.useMutation({
    onSuccess: () => refetch(),
  });
  const playTrack = api.player.playTrack.useMutation({
    onSuccess: () => refetchPlayback(),
  });
  const pauseTrack = api.player.pauseTrack.useMutation({
    onSuccess: () => refetchPlayback(),
  });

  const pause = () => {
    pauseTrack.mutate({ accessToken: token || "" });
  };

  const activeDevice: PlaybackDevice | undefined = devices?.find(
    (d: PlaybackDevice) => d.is_active,
  );

  const play = (trackUrl: string) => {
    console.log("play");
    playTrack.mutate({
      accessToken: token || "",
      trackUrl,
      deviceId: activeDevice?.id || "",
    });
  };

  const setActiveDevice = (deviceId: string) => {
    transferPlayback.mutate({ accessToken: token || "", deviceId });
  };

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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);
