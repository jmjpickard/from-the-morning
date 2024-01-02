import axios, { AxiosInstance } from "axios";
import { PlaybackDevice } from "~/components/Player";
import { env } from "~/env.mjs";
import { PlaybackState } from "~/types/playbackState";
import { Track } from "~/types/track";

const fetchSpotify = (accessToken: string): AxiosInstance => {
  return axios.create({
    baseURL: env.SPOTIFY_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const transferPlaybackDevice = async (
  deviceId: string,
  accessToken: string,
) => {
  const fetch = fetchSpotify(accessToken);
  try {
    await fetch.put("/me/player", {
      device_ids: [deviceId],
    });
    return "success";
  } catch (error) {
    throw new Error("Error transferring playback");
  }
};

export const getAvailableDevices = async (accessToken: string) => {
  const fetch = fetchSpotify(accessToken);
  try {
    const response = await fetch.get<{ devices: PlaybackDevice[] }>(
      "/me/player/devices",
    );
    return response.data.devices;
  } catch (error) {
    throw new Error("Error fetching devices");
  }
};

export const getPlaybackState = async (accessToken: string) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const { data: playbackState } =
      await fetch.get<PlaybackState>("/me/player");

    return playbackState;
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
  }
};

export const playTrackRequest = async (
  accessToken: string,
  trackUri: string,
  deviceId: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    await fetch.put("/me/player/play", {
      device_id: deviceId,
      uris: [trackUri],
    });
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export const pauseTrackRequest = async (accessToken: string) => {
  const fetch = fetchSpotify(accessToken);

  try {
    await fetch.put("/me/player/pause");
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export const getTrack = async (accessToken: string, trackId: string) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const { data: track } = await fetch.get<Track>(`/tracks/${trackId}`);
    return track;
  } catch (error) {
    console.error(error);
  }
};
