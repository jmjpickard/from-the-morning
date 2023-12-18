import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAccessToken } from "../userService";

export const userRouter = createTRPCRouter({
  getAccessToken: protectedProcedure.query(async ({ ctx }) => {
    const account = await ctx.db.account.findFirst({
      where: { userId: ctx.session.user.id },
    });
    if (!account) {
      throw new Error("No session found");
    }
    const token = await getAccessToken(account.refresh_token ?? "");
    console.log("getAccessToken", token);
    return token as string;
  }),
});
