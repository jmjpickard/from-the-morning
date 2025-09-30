import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  getAvailableDevices,
  getPlaybackState,
  getTrack,
  pauseTrackRequest,
  playTrackRequest,
  transferPlaybackDevice,
  skipToNextTrack,
  skipToPreviousTrack,
  seekToPosition,
  setPlaybackVolume,
  toggleShuffle,
  setRepeatMode,
  addToQueue,
  getRecentlyPlayed,
  getUserQueue,
} from "../playerService";

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
  skipNext: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await skipToNextTrack(input.accessToken, input.deviceId);
      return response;
    }),
  skipPrevious: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await skipToPreviousTrack(
        input.accessToken,
        input.deviceId,
      );
      return response;
    }),
  seek: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        positionMs: z.number(),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await seekToPosition(
        input.accessToken,
        input.positionMs,
        input.deviceId,
      );
      return response;
    }),
  setVolume: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        volumePercent: z.number().min(0).max(100),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await setPlaybackVolume(
        input.accessToken,
        input.volumePercent,
        input.deviceId,
      );
      return response;
    }),
  toggleShuffle: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        state: z.boolean(),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await toggleShuffle(
        input.accessToken,
        input.state,
        input.deviceId,
      );
      return response;
    }),
  setRepeat: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        state: z.enum(["track", "context", "off"]),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await setRepeatMode(
        input.accessToken,
        input.state,
        input.deviceId,
      );
      return response;
    }),
  addToQueue: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        uri: z.string(),
        deviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await addToQueue(
        input.accessToken,
        input.uri,
        input.deviceId,
      );
      return response;
    }),
  getRecentlyPlayed: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        limit: z.number().min(1).max(50).optional().default(20),
      }),
    )
    .query(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const recentlyPlayed = await getRecentlyPlayed(
        input.accessToken,
        input.limit,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return recentlyPlayed;
    }),
  getUserQueue: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const queue = await getUserQueue(input.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return queue;
    }),
});
