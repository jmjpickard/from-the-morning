import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import type { PlaybackDevice } from "~/components/Player";

interface DiagnosticCheck {
  name: string;
  status: "pending" | "success" | "error" | "warning";
  message: string;
  details?: string;
  timestamp: string;
}

interface AccountData {
  success?: boolean;
  error?: string;
  account?: {
    provider?: string;
    has_refresh_token?: boolean;
    expires_at_readable?: string;
    is_expired?: boolean;
  };
  scopes?: string[];
  requiredScopes?: string[];
}

interface SpotifyAPIResponse {
  logs?: string[];
  error?: string;
}

export default function DiagnosticsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [checks, setChecks] = useState<DiagnosticCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [spotifyLogs, setSpotifyLogs] = useState<string[]>([]);

  // API queries
  const { data: token, error: tokenError, isLoading: tokenLoading } = 
    api.user.getAccessToken.useQuery(undefined, { 
      enabled: !!session,
      retry: false 
    });

  const { data: devices, error: devicesError, isLoading: devicesLoading, refetch: refetchDevices } = 
    api.player.getDevices.useQuery(
      { accessToken: token ?? "" },
      { 
        enabled: !!token,
        retry: false 
      }
    );

  const { data: playback, error: playbackError, isLoading: playbackLoading, refetch: refetchPlayback } = 
    api.player.getCurrentPlaybackState.useQuery(
      { accessToken: token ?? "" },
      { 
        enabled: !!token,
        retry: false,
        refetchInterval: autoRefresh ? 3000 : false
      }
    );

  const addCheck = useCallback((check: Omit<DiagnosticCheck, "timestamp">) => {
    setChecks((prev: DiagnosticCheck[]) => [...prev, { ...check, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const checkAccount = async (): Promise<AccountData | null> => {
    try {
      const response = await fetch("/api/debug/check-account");
      const data = await response.json() as AccountData;
      return data;
    } catch (error) {
      console.error("Error checking account:", error);
      return null;
    }
  };

  const testSpotifyAPI = async () => {
    setSpotifyLogs(["Running test..."]);
    try {
      const response = await fetch("/api/debug/test-spotify");
      const data = await response.json() as SpotifyAPIResponse;
      if (data.logs) {
        setSpotifyLogs(data.logs);
      } else {
        setSpotifyLogs([`Error: ${data.error ?? "Unknown error"}`]);
      }
    } catch (error) {
      setSpotifyLogs([`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`]);
    }
  };

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    setChecks([]);

    // Check 1: Session
    addCheck({
      name: "NextAuth Session",
      status: sessionStatus === "authenticated" ? "success" : "error",
      message: sessionStatus === "authenticated" 
        ? `Authenticated as ${session?.user?.email ?? "Unknown"}` 
        : `Session status: ${sessionStatus}`,
      details: session ? JSON.stringify(session.user, null, 2) : undefined
    });

    if (sessionStatus !== "authenticated") {
      setIsRunning(false);
      return;
    }

    // Check 2: Database Account
    const accountInfo = await checkAccount();
    if (accountInfo?.success) {
      const missingScopes = (accountInfo.requiredScopes ?? []).filter(
        (scope: string) => !(accountInfo.scopes ?? []).includes(scope)
      );
      
      addCheck({
        name: "Database Account Record",
        status: accountInfo.account?.has_refresh_token ? "success" : "error",
        message: accountInfo.account?.has_refresh_token 
          ? "Account found with refresh token" 
          : "Account missing refresh token",
        details: JSON.stringify({
          provider: accountInfo.account?.provider,
          has_refresh_token: accountInfo.account?.has_refresh_token,
          scopes: accountInfo.scopes,
          missing_scopes: missingScopes,
          token_expires: accountInfo.account?.expires_at_readable,
          is_expired: accountInfo.account?.is_expired
        }, null, 2)
      });

      if (missingScopes.length > 0) {
        addCheck({
          name: "OAuth Scopes",
          status: "error",
          message: `Missing ${missingScopes.length} required scope(s)`,
          details: `Missing: ${missingScopes.join(", ")}\n\nYou need to sign out and sign in again to grant new scopes.`
        });
      }
    } else {
      addCheck({
        name: "Database Account Record",
        status: "error",
        message: "Could not fetch account data",
        details: accountInfo?.error ?? "Unknown error"
      });
    }

    // Wait a bit for token query
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check 3: Access Token
    if (tokenLoading) {
      addCheck({
        name: "Spotify Access Token",
        status: "pending",
        message: "Loading access token...",
      });
    } else if (tokenError) {
      addCheck({
        name: "Spotify Access Token",
        status: "error",
        message: "Failed to get access token",
        details: tokenError.message
      });
      setIsRunning(false);
      return;
    } else if (token) {
      addCheck({
        name: "Spotify Access Token",
        status: "success",
        message: "Token retrieved successfully",
        details: `Token: ${token.substring(0, 20)}...${token.substring(token.length - 10)}`
      });
    } else {
      addCheck({
        name: "Spotify Access Token",
        status: "error",
        message: "Token is undefined",
        details: "Check if refresh_token exists in database Account table"
      });
      setIsRunning(false);
      return;
    }

    // Wait for devices query
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check 4: Spotify Devices
    if (devicesLoading) {
      addCheck({
        name: "Spotify Devices",
        status: "pending",
        message: "Fetching available devices...",
      });
    } else if (devicesError) {
      addCheck({
        name: "Spotify Devices",
        status: "error",
        message: "Failed to fetch devices",
        details: devicesError.message
      });
    } else if (devices) {
      if (devices.length === 0) {
        addCheck({
          name: "Spotify Devices",
          status: "warning",
          message: "No Spotify devices found",
          details: "Open Spotify on your phone, computer, or wait for Web Playback SDK to initialize"
        });
      } else {
        addCheck({
          name: "Spotify Devices",
          status: "success",
          message: `Found ${devices.length} device(s)`,
          details: JSON.stringify(devices.map(d => ({
            name: d.name,
            type: d.type,
            is_active: d.is_active,
            volume: d.volume_percent
          })), null, 2)
        });
      }
    }

    // Wait for playback query
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check 5: Current Playback
    if (playbackLoading) {
      addCheck({
        name: "Current Playback State",
        status: "pending",
        message: "Fetching playback state...",
      });
    } else if (playbackError) {
      addCheck({
        name: "Current Playback State",
        status: "error",
        message: "Failed to fetch playback state",
        details: playbackError.message
      });
    } else if (playback) {
      addCheck({
        name: "Current Playback State",
        status: "success",
        message: playback.is_playing ? "Playing" : "Paused",
        details: JSON.stringify({
          track: playback.item?.name,
          artist: playback.item?.artists?.[0]?.name,
          device: playback.device?.name,
          progress: `${Math.floor((playback.progress_ms ?? 0) / 1000)}s / ${Math.floor((playback.item?.duration_ms ?? 0) / 1000)}s`
        }, null, 2)
      });
    } else {
      addCheck({
        name: "Current Playback State",
        status: "warning",
        message: "No active playback",
        details: "Start playing a track on any device to see playback state"
      });
    }

    // Check 6: Web Playback SDK
    if (typeof window !== "undefined" && window.Spotify) {
      addCheck({
        name: "Web Playback SDK",
        status: "success",
        message: "SDK loaded",
        details: "Spotify Web Playback SDK is available"
      });
    } else {
      addCheck({
        name: "Web Playback SDK",
        status: "warning",
        message: "SDK not loaded yet",
        details: "Web player will initialize when Player component mounts"
      });
    }

    // Check 7: Environment Variables (client-side check)
    addCheck({
      name: "Environment Check",
      status: "success",
      message: "Configuration check",
      details: `Next.js Environment: ${process.env.NODE_ENV}\n\nNote: Server-side env vars (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, NEXTAUTH_SECRET) cannot be checked from client. Verify in Vercel dashboard.`
    });

    setIsRunning(false);
  }, [sessionStatus, session, tokenLoading, tokenError, token, devicesLoading, devicesError, devices, playbackLoading, playbackError, playback, addCheck]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      void runDiagnostics();
    }
  }, [sessionStatus, runDiagnostics]);

  const getStatusColor = (status: DiagnosticCheck["status"]) => {
    switch (status) {
      case "success": return "bg-green-100 border-green-500 text-green-900";
      case "error": return "bg-red-100 border-red-500 text-red-900";
      case "warning": return "bg-yellow-100 border-yellow-500 text-yellow-900";
      case "pending": return "bg-blue-100 border-blue-500 text-blue-900";
    }
  };

  const getStatusIcon = (status: DiagnosticCheck["status"]) => {
    switch (status) {
      case "success": return "✓";
      case "error": return "✕";
      case "warning": return "⚠";
      case "pending": return "⏳";
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading session...</div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <Link href="/signin" className="text-blue-600 hover:underline">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Spotify Connection Diagnostics</h1>
          <p className="text-gray-600 mb-4">
            Real-time debugging dashboard for your Spotify integration
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => void runDiagnostics()}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isRunning ? "Running..." : "Run Diagnostics"}
            </button>
            
            <button
              onClick={() => {
                void refetchDevices();
                void refetchPlayback();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Refresh Data
            </button>

            <button
              onClick={() => void testSpotifyAPI()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test API Calls
            </button>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Auto-refresh (3s)</span>
            </label>
          </div>

          {/* Live Data Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded">
            <div>
              <div className="text-sm text-gray-600">Token Status</div>
              <div className="font-semibold">
                {tokenLoading ? "Loading..." : token ? "✓ Valid" : "✕ Missing"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Devices</div>
              <div className="font-semibold">
                {devicesLoading ? "Loading..." : `${devices?.length ?? 0} found`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Device</div>
              <div className="font-semibold">
                {devices?.find((d: PlaybackDevice) => d.is_active)?.name ?? "None"}
              </div>
            </div>
          </div>

          {/* Current Track Info */}
          {playback?.item && (
            <div className="p-4 bg-green-50 border border-green-200 rounded mb-6">
              <div className="font-semibold mb-2">🎵 Currently Playing:</div>
              <div className="text-lg">{playback.item.name}</div>
              <div className="text-gray-600">
                {playback.item.artists?.map((a: { name: string }) => a.name).join(", ")}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {playback.is_playing ? "▶️ Playing" : "⏸️ Paused"} on {playback.device?.name}
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Checks */}
        <div className="space-y-4">
          {checks.map((check: DiagnosticCheck, index: number) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg shadow p-4 ${getStatusColor(check.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStatusIcon(check.status)}</span>
                  <div>
                    <h3 className="font-bold">{check.name}</h3>
                    <p className="text-sm">{check.message}</p>
                  </div>
                </div>
                <span className="text-xs opacity-60">{check.timestamp}</span>
              </div>
              {check.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-semibold">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs overflow-x-auto">
                    {check.details}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {checks.length === 0 && !isRunning && (
          <div className="text-center text-gray-500 py-8">
            Click &quot;Run Diagnostics&quot; to start checking your Spotify connection
          </div>
        )}

        {/* Spotify API Test Logs */}
        {spotifyLogs.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🔍 Spotify API Test Results</h2>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              {spotifyLogs.map((log: string, index: number) => (
                <div key={index}>{log}</div>
              ))}
            </div>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(spotifyLogs.join("\n"));
                alert("Logs copied to clipboard!");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              📋 Copy Logs
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                window.open("https://www.spotify.com/account/apps/", "_blank");
              }}
              className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              📱 Manage Spotify App Permissions
            </button>
            <button
              onClick={() => {
                window.open("https://developer.spotify.com/dashboard/", "_blank");
              }}
              className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              🔧 Spotify Developer Dashboard
            </button>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(JSON.stringify({
                  token: token ? "present" : "missing",
                  devices: devices?.length ?? 0,
                  activeDevice: devices?.find((d: PlaybackDevice) => d.is_active)?.name ?? "none",
                  playback: playback ? "active" : "none",
                  checks: checks
                }, null, 2));
                alert("Diagnostic data copied to clipboard!");
              }}
              className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              📋 Copy Diagnostic Data
            </button>
          </div>
        </div>

        {/* Common Issues */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Common Issues & Solutions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-semibold">❌ No Access Token</div>
              <div className="text-gray-700">
                • Check if SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set in Vercel
                <br />
                • Verify the Account table has a refresh_token for your user
                <br />
                • Try signing out and signing in again
              </div>
            </div>
            <div>
              <div className="font-semibold">❌ No Devices Found</div>
              <div className="text-gray-700">
                • Open Spotify app on your phone or computer
                <br />
                • Play any song to activate a device
                <br />
                • Wait 5-10 seconds for Web Player to initialize
              </div>
            </div>
            <div>
              <div className="font-semibold">❌ Playback Not Working</div>
              <div className="text-gray-700">
                • Ensure an active device is selected (green indicator)
                <br />
                • Check if you have Spotify Premium (required for playback control)
                <br />
                • Verify streaming scope is granted
              </div>
            </div>
            <div>
              <div className="font-semibold">❌ Authentication Errors</div>
              <div className="text-gray-700">
                • Verify NEXTAUTH_SECRET is set in Vercel
                <br />
                • Check if redirect URI matches in Spotify Dashboard
                <br />
                • Make sure app is not in development mode on Spotify
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
