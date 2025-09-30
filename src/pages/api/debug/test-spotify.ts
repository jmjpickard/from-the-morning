import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { getAccessToken } from "~/server/api/userService";

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

    const logs: string[] = [];
    logs.push(`[${new Date().toISOString()}] Starting Spotify API test`);
    logs.push(`User ID: ${session.user.id}`);
    logs.push(`Email: ${session.user.email}`);

    // Step 1: Get account from database
    logs.push("\n--- Step 1: Database Query ---");
    const account = await db.account.findFirst({
      where: { userId: session.user.id },
    });

    if (!account) {
      logs.push("❌ No account found in database");
      return res.status(404).json({ 
        error: "No account found",
        logs 
      });
    }

    logs.push(`✓ Account found: ${account.provider}`);
    logs.push(`  Has refresh_token: ${!!account.refresh_token}`);
    logs.push(`  Has access_token: ${!!account.access_token}`);
    logs.push(`  Expires at: ${account.expires_at ? new Date(account.expires_at * 1000).toISOString() : "unknown"}`);
    logs.push(`  Scopes: ${account.scope || "none"}`);

    if (!account.refresh_token) {
      logs.push("❌ No refresh token found");
      return res.status(400).json({ 
        error: "No refresh token",
        logs 
      });
    }

    // Step 2: Get fresh access token
    logs.push("\n--- Step 2: Token Refresh ---");
    let accessToken: string;
    try {
      accessToken = await getAccessToken(account.refresh_token);
      logs.push(`✓ Access token obtained: ${accessToken.substring(0, 20)}...`);
    } catch (error) {
      logs.push(`❌ Token refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return res.status(500).json({ 
        error: "Token refresh failed",
        details: error instanceof Error ? error.message : "Unknown error",
        logs 
      });
    }

    // Step 3: Test Spotify API - Get Current User
    logs.push("\n--- Step 3: Test Spotify API (Get Current User) ---");
    try {
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      logs.push(`Status: ${userResponse.status} ${userResponse.statusText}`);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        logs.push(`✓ Successfully authenticated as: ${userData.display_name || userData.id}`);
        logs.push(`  Product: ${userData.product || "unknown"}`);
        logs.push(`  Country: ${userData.country || "unknown"}`);
      } else {
        const errorData = await userResponse.text();
        logs.push(`❌ API Error: ${errorData}`);
      }
    } catch (error) {
      logs.push(`❌ Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Step 4: Test Get Devices
    logs.push("\n--- Step 4: Test Get Available Devices ---");
    try {
      const devicesResponse = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      logs.push(`Status: ${devicesResponse.status} ${devicesResponse.statusText}`);
      
      if (devicesResponse.ok) {
        const devicesData = await devicesResponse.json();
        logs.push(`✓ Devices fetched successfully`);
        logs.push(`  Device count: ${devicesData.devices?.length || 0}`);
        if (devicesData.devices && devicesData.devices.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          devicesData.devices.forEach((device: any, index: number) => {
            logs.push(`  [${index + 1}] ${device.name} (${device.type}) - Active: ${device.is_active}`);
          });
        } else {
          logs.push(`  ⚠️ No devices available. Open Spotify on a device.`);
        }
      } else {
        const errorData = await devicesResponse.text();
        logs.push(`❌ API Error: ${errorData}`);
      }
    } catch (error) {
      logs.push(`❌ Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Step 5: Test Get Current Playback
    logs.push("\n--- Step 5: Test Get Current Playback ---");
    try {
      const playbackResponse = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      logs.push(`Status: ${playbackResponse.status} ${playbackResponse.statusText}`);
      
      if (playbackResponse.status === 204) {
        logs.push(`ℹ️ No playback currently active (204 No Content)`);
      } else if (playbackResponse.ok) {
        const playbackData = await playbackResponse.json();
        logs.push(`✓ Playback state fetched successfully`);
        logs.push(`  Playing: ${playbackData.is_playing}`);
        logs.push(`  Track: ${playbackData.item?.name || "N/A"}`);
        logs.push(`  Artist: ${playbackData.item?.artists?.[0]?.name || "N/A"}`);
        logs.push(`  Device: ${playbackData.device?.name || "N/A"}`);
      } else {
        const errorData = await playbackResponse.text();
        logs.push(`❌ API Error: ${errorData}`);
      }
    } catch (error) {
      logs.push(`❌ Request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    logs.push("\n--- Test Complete ---");

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      logs,
    });
  } catch (error) {
    console.error("Error in Spotify test:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
