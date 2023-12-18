import React, { useContext } from "react";
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
  playerState?: string;
  currentTrack?: string;
  devices?: PlaybackDevice[];
  activeDevice?: PlaybackDevice;
  setActiveDevice: (deviceId: string) => void;
  setActiveIsLoading: boolean;
  play: (trackId: string) => void;
  pause: () => void;
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

  const transferPlayback = api.player.transferPlayback.useMutation({
    onSuccess: () => refetch(),
  });
  const playTrack = api.player.playTrack.useMutation();

  const pause = () => {
    console.log("pause");
  };

  const activeDevice: PlaybackDevice | undefined = devices?.find(
    (d: PlaybackDevice) => d.is_active,
  );

  const play = (trackId: string) => {
    console.log("play");
    playTrack.mutate({
      accessToken: token || "",
      trackId,
      deviceId: activeDevice?.id || "",
    });
  };

  const setActiveDevice = (deviceId: string) => {
    console.log({ deviceId });
    transferPlayback.mutate({ accessToken: token || "", deviceId });
  };

  return (
    <SpotifyContext.Provider
      value={{
        playerState,
        currentTrack,
        devices,
        activeDevice,
        setActiveDevice,
        setActiveIsLoading: transferPlayback.isLoading,
        play,
        pause,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => useContext(SpotifyContext);
