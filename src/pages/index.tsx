import type { NextPage } from "next";
import React from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BlogEntry } from "~/components/BlogEntry";
import { NavBar } from "~/components/NavBar";
import { PlayBar } from "~/components/PlayBar";
import { api } from "~/utils/api";
import { useSpotify } from "~/components/Player";
import type { Post } from "@prisma/client";

// Feed now comes from backend

const Home: NextPage = () => {
  const session = useSession();
  const isAuth = session.status === "authenticated";
  const isAuthLoading = session.status === "loading";
  const spotify = useSpotify();
  const feed = api.post.getFeed.useQuery(undefined, { enabled: isAuth });

  const router = useRouter();
  React.useEffect(() => {
    if (!isAuth && !isAuthLoading) {
      void router.push("/signin");
    }
  }, [session, isAuthLoading, isAuth, router]);

  React.useEffect(() => {
    const posts = (feed.data ?? []) as (Post & { createdBy: unknown })[];
    if (posts.length) {
      const uris = posts.map((p) => `spotify:track:${p.trackId}`);
      spotify?.setQueue(uris, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed.data?.length]);

  return (
    <>
      <Head>
        <title>From the morning</title>
        <meta name="description" content="From the morning music blog" />
        <link rel="icon" href="/icons8-play-ios-16-32.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-background font-mono text-foreground">
        <NavBar />
        {isAuth ? (
          <div className="mb-24 flex w-full flex-col items-center justify-center gap-4">
            {(feed.data as (Post & { createdBy: unknown })[] | undefined)?.map((post, idx) => (
              <BlogEntry
                key={post.id}
                content={post.content ?? ""}
                trackId={post.trackId}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <p>Redirecting...</p>
        )}
      </main>
      <PlayBar />
    </>
  );
};

export default Home;
