interface SpotifyTokenResponse {
  access_token: string;
}

export const getAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to refresh access token. Status: ${response.status}`,
    );
  }

  const responseData = (await response.json()) as SpotifyTokenResponse;

  return responseData.access_token;
};
