import axios, { type AxiosInstance } from "axios";
import type { PlaybackDevice } from "~/components/Player";
import { env } from "~/env.mjs";
import type { PlaybackState } from "~/types/playbackState";
import type { Track } from "~/types/track";

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

export const skipToNextTrack = async (
  accessToken: string,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params = deviceId ? { device_id: deviceId } : {};
    await fetch.post("/me/player/next", null, { params });
    return "success";
  } catch (error) {
    console.error("Error skipping to next track:", error);
    return "error";
  }
};

export const skipToPreviousTrack = async (
  accessToken: string,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params = deviceId ? { device_id: deviceId } : {};
    await fetch.post("/me/player/previous", null, { params });
    return "success";
  } catch (error) {
    console.error("Error skipping to previous track:", error);
    return "error";
  }
};

export const seekToPosition = async (
  accessToken: string,
  positionMs: number,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params: { position_ms: number; device_id?: string } = {
      position_ms: positionMs,
    };
    if (deviceId) params.device_id = deviceId;
    await fetch.put("/me/player/seek", null, { params });
    return "success";
  } catch (error) {
    console.error("Error seeking to position:", error);
    return "error";
  }
};

export const setPlaybackVolume = async (
  accessToken: string,
  volumePercent: number,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params: { volume_percent: number; device_id?: string } = {
      volume_percent: Math.max(0, Math.min(100, volumePercent)),
    };
    if (deviceId) params.device_id = deviceId;
    await fetch.put("/me/player/volume", null, { params });
    return "success";
  } catch (error) {
    console.error("Error setting volume:", error);
    return "error";
  }
};

export const toggleShuffle = async (
  accessToken: string,
  state: boolean,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params: { state: boolean; device_id?: string } = { state };
    if (deviceId) params.device_id = deviceId;
    await fetch.put("/me/player/shuffle", null, { params });
    return "success";
  } catch (error) {
    console.error("Error toggling shuffle:", error);
    return "error";
  }
};

export const setRepeatMode = async (
  accessToken: string,
  state: "track" | "context" | "off",
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params: { state: string; device_id?: string } = { state };
    if (deviceId) params.device_id = deviceId;
    await fetch.put("/me/player/repeat", null, { params });
    return "success";
  } catch (error) {
    console.error("Error setting repeat mode:", error);
    return "error";
  }
};

export const addToQueue = async (
  accessToken: string,
  uri: string,
  deviceId?: string,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const params: { uri: string; device_id?: string } = { uri };
    if (deviceId) params.device_id = deviceId;
    await fetch.post("/me/player/queue", null, { params });
    return "success";
  } catch (error) {
    console.error("Error adding to queue:", error);
    return "error";
  }
};

export const getRecentlyPlayed = async (
  accessToken: string,
  limit = 20,
) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const response = await fetch.get("/me/player/recently-played", {
      params: { limit: Math.min(50, limit) },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  } catch (error) {
    console.error("Error fetching recently played:", error);
  }
};

export const getUserQueue = async (accessToken: string) => {
  const fetch = fetchSpotify(accessToken);

  try {
    const response = await fetch.get("/me/player/queue");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  } catch (error) {
    console.error("Error fetching user queue:", error);
  }
};
