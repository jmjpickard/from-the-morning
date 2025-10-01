import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

/**
 * Force re-authentication by deleting the account record.
 * This will require the user to sign in again and grant new OAuth scopes.
 * 
 * IMPORTANT: This is a debugging tool. Use with caution.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const logs: string[] = [];
    logs.push(`[${new Date().toISOString()}] Force re-authentication requested`);
    logs.push(`User ID: ${session.user.id}`);
    logs.push(`Email: ${session.user.email ?? "unknown"}`);

    // Check if account exists
    const account = await db.account.findFirst({
      where: { userId: session.user.id },
      select: {
        id: true,
        provider: true,
        scope: true,
      },
    });

    if (!account) {
      logs.push("❌ No account found to delete");
      return res.status(404).json({ 
        error: "No account found",
        logs 
      });
    }

    logs.push(`✓ Found account: ${account.provider}`);
    logs.push(`  Current scopes: ${account.scope ?? "none"}`);
    logs.push(`  Account ID: ${account.id}`);

    // Delete the account record
    logs.push("\n--- Deleting account record ---");
    await db.account.delete({
      where: { id: account.id },
    });
    logs.push("✓ Account record deleted successfully");

    // Verify deletion
    const verifyAccount = await db.account.findFirst({
      where: { userId: session.user.id },
    });

    if (verifyAccount) {
      logs.push("⚠️ Warning: Account still exists after deletion attempt");
      return res.status(500).json({ 
        error: "Failed to delete account",
        logs 
      });
    }

    logs.push("✓ Verified: Account successfully removed");
    logs.push("\n--- Next Steps ---");
    logs.push("1. Sign out from the application");
    logs.push("2. Sign in again with Spotify");
    logs.push("3. Grant all requested permissions");
    logs.push("4. Run diagnostics again to verify new scopes");

    return res.status(200).json({
      success: true,
      message: "Account deleted. Please sign out and sign in again.",
      timestamp: new Date().toISOString(),
      logs,
    });
  } catch (error) {
    console.error("Error in force re-auth:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
