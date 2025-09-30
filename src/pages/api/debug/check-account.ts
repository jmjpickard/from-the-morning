import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch account data
    const account = await db.account.findFirst({
      where: { userId: session.user.id },
      select: {
        provider: true,
        type: true,
        scope: true,
        token_type: true,
        expires_at: true,
        // Don't send actual tokens for security, just check if they exist
        refresh_token: true,
        access_token: true,
      },
    });

    if (!account) {
      return res.status(404).json({ 
        error: "No account found",
        message: "User has no linked account in database"
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const hasRefreshToken = !!account.refresh_token;
    const hasAccessToken = !!account.access_token;
    const isExpired = account.expires_at ? account.expires_at < now : true;

    return res.status(200).json({
      success: true,
      account: {
        provider: account.provider,
        type: account.type,
        scope: account.scope,
        token_type: account.token_type,
        expires_at: account.expires_at,
        expires_at_readable: account.expires_at 
          ? new Date(account.expires_at * 1000).toLocaleString() 
          : "unknown",
        is_expired: isExpired,
        has_refresh_token: hasRefreshToken,
        has_access_token: hasAccessToken,
        refresh_token_preview: hasRefreshToken 
          ? `${account.refresh_token!.substring(0, 10)}...` 
          : null,
      },
      scopes: account.scope?.split(" ") || [],
      requiredScopes: [
        "user-read-email",
        "user-modify-playback-state",
        "user-read-playback-state",
        "user-read-currently-playing",
        "user-read-recently-played",
        "streaming",
      ],
      scopesMatch: account.scope?.includes("streaming") || false,
    });
  } catch (error) {
    console.error("Error checking account:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
