import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  getAvailableDevices,
  getPlaybackState,
  getTrack,
  pauseTrackRequest,
  playTrackRequest,
  transferPlaybackDevice,
} from "../playerService";
import { Track } from "~/types/track";
import { PlaybackState } from "~/types/playbackState";

export const playerRouter = createTRPCRouter({
  transferPlayback: protectedProcedure
    .input(z.object({ deviceId: z.string(), accessToken: z.string() }))
    .mutation(async ({ input }) => {
      const playbackRes = await transferPlaybackDevice(
        input.deviceId,
        input.accessToken,
      );
      return playbackRes;
    }),
  getDevices: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const devices = await getAvailableDevices(input.accessToken);
      return devices;
    }),
  getCurrentPlaybackState: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      const playbackState = await getPlaybackState(input.accessToken);
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
    .mutation(async ({ input }) => {
      const response = playTrackRequest(
        input.accessToken,
        input.trackUrl,
        input.deviceId,
      );
      return response;
    }),
  pauseTrack: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .mutation(async ({ input }) => {
      const response = await pauseTrackRequest(input.accessToken);
      return response;
    }),
  getTrack: protectedProcedure
    .input(z.object({ accessToken: z.string(), trackId: z.string() }))
    .query(async ({ input }) => {
      const track = await getTrack(input.accessToken, input.trackId);
      return track;
    }),
});
