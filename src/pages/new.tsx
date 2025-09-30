import type { NextPage } from "next";
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NavBar } from "~/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "~/utils/api";

const NewPostPage: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const isAuth = session.status === "authenticated";
  const isAuthLoading = session.status === "loading";

  const [trackUrlOrId, setTrackUrlOrId] = React.useState("");
  const [content, setContent] = React.useState("");

  const mutation = api.post.create.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
  });

  React.useEffect(() => {
    if (!isAuth && !isAuthLoading) {
      void router.push("/signin");
    }
  }, [isAuth, isAuthLoading, router]);

  const extractTrackId = (input: string): string => {
    // Accept raw track id or full Spotify URL
    try {
      const url = new URL(input);
      const parts = url.pathname.split("/");
      const idx = parts.findIndex((p) => p === "track");
      if (idx !== -1) {
        const maybeId = parts[idx + 1];
        if (maybeId) return maybeId;
      }
      // Also support Spotify URI
      if (input.startsWith("spotify:track:")) return input.replace("spotify:track:", "");
    } catch (e) {
      // not a URL; assume raw id
    }
    return input;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackId = extractTrackId(trackUrlOrId).trim();
    if (!trackId) return;
    mutation.mutate({ trackId, content: content.trim() || undefined });
  };

  return (
    <>
      <Head>
        <title>New Post - From the morning</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-background font-mono text-foreground">
        <NavBar />
        <div className="flex w-full max-w-xl flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a new post</CardTitle>
              <CardDescription>Paste a Spotify track link or ID and say why you like it.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 pt-0">
              <label className="text-sm" htmlFor="track">
                Spotify track URL or ID
              </label>
              <input
                id="track"
                type="text"
                className="rounded border p-2"
                placeholder="https://open.spotify.com/track/0kN5FVdrkO1w7itaepBMwM"
                value={trackUrlOrId}
                onChange={(e) => setTrackUrlOrId(e.target.value)}
                required
              />
              <label className="text-sm" htmlFor="content">
                Why do you like it?
              </label>
              <textarea
                id="content"
                className="min-h-[120px] rounded border p-2"
                placeholder="A few thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={mutation.isLoading}>
                  {mutation.isLoading ? "Posting..." : "Post"}
                </Button>
                {mutation.error && (
                  <span className="text-sm text-red-600">{mutation.error.message}</span>
                )}
              </div>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
};

export default NewPostPage;

