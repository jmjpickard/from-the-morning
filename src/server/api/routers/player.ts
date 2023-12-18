import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import {
  getAvailableDevices,
  getPlaybackState,
  playTrackRequest,
  transferPlaybackDevice,
} from "../playerService";

export const playerRouter = createTRPCRouter({
  transferPlayback: protectedProcedure
    .input(z.object({ deviceId: z.string(), accessToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const playbackRes = await transferPlaybackDevice(
        input.deviceId,
        input.accessToken,
      );
      console.log("getAccessToken", playbackRes);
      return playbackRes;
    }),
  getDevices: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ ctx, input }) => {
      const devices = await getAvailableDevices(input.accessToken);
      console.log("getDevices", devices);
      return devices;
    }),
  getCurrentPlaybackState: protectedProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log({ input });
      const playbackState = await getPlaybackState(input.accessToken);
      console.log("getPlaybackState", playbackState);
      return playbackState;
    }),
  playTrack: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        trackId: z.string(),
        deviceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = playTrackRequest(
        input.accessToken,
        input.trackId,
        input.deviceId,
      );
      return response;
    }),
});
