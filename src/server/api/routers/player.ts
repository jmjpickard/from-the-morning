import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  getAvailableDevices,
  getPlaybackState,
  playTrackRequest,
  transferPlaybackDevice,
} from "../playerService";
import { Track } from "~/types/track";
import { PlaybackState } from "~/types/playbackState";

export const playerRouter = createTRPCRouter({
  transferPlayback: protectedProcedure
    .input(z.object({ deviceId: z.string(), accessToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const playbackRes = await transferPlaybackDevice(
        input.deviceId,
        input.accessToken,
      );
      return playbackRes;
    }),
  getDevices: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ ctx, input }) => {
      const devices = await getAvailableDevices(input.accessToken);
      return devices;
    }),
  getCurrentPlaybackState: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ ctx, input }) => {
      const playbackState: PlaybackState = await getPlaybackState(
        input.accessToken,
      );
      if (playbackState !== undefined) {
        return playbackState;
      }
      return null;
    }),
  playTrack: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        trackUrl: z.string(),
        deviceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = playTrackRequest(
        input.accessToken,
        input.trackUrl,
        input.deviceId,
      );
      return response;
    }),
  pauseTrack: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/pause`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          console.log(error);
        });
      return response;
    }),
  getTrack: protectedProcedure
    .input(z.object({ accessToken: z.string(), trackId: z.string() }))
    .query(async ({ ctx, input }) => {
      const response: Track = await fetch(
        `https://api.spotify.com/v1/tracks/${input.trackId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          console.log(error);
        });

      return response;
    }),
});
