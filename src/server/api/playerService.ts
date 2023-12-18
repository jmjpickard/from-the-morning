import { access } from "fs";

export const transferPlaybackDevice = async (
  deviceId: string,
  accessToken: string,
) => {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [deviceId],
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return "success";
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });

  return response;
};

export const getAvailableDevices = async (accessToken: string) => {
  const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });

  return response.devices;
};

export const getPlaybackState = async (accessToken: string) => {
  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      response.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return response;
};

export const playTrackRequest = async (
  accessToken: string,
  trackId: string,
  deviceId: string,
) => {
  const response = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      device_id: deviceId,
      context_uri: "spotify:track:47s4suMScnmNQ2Vu4e0blc",
    }),
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${response.body}`,
        );
      }
      return "success";
    })
    .catch((error) => {
      console.log(error);
    });

  return response;
};
