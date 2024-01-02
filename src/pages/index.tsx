import type { NextPage } from "next";
import React from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BlogEntry } from "~/components/BlogEntry";
import { NavBar } from "~/components/NavBar";
import { PlayBar } from "~/components/PlayBar";

const BLOGS = [
  {
    title: "Nick Drake - From the morning",
    content: "From the morning, from the morning, from the morning",
    trackUri: "6meH4I9A4WZtD3z8hnQKqr",
  },
  {
    title: "Anohni & the johnsons",
    content: "First track from the new album - one of the best of 2023",
    trackUri: "0kN5FVdrkO1w7itaepBMwM",
  },
  {
    title: "Holly Humberstone",
    content: "A nice song",
    trackUri: "1eTD6LXZ233IaiyI5fvtJa",
  },
  {
    title: "Leif",
    content: "Very nice chilled piano folk",
    trackUri: "3gaH1EhTC53WZeFRj3hGtp",
  },
];

const Home: NextPage = () => {
  const session = useSession();
  const isAuth = session.status === "authenticated";
  const isAuthLoading = session.status === "loading";

  const router = useRouter();
  React.useEffect(() => {
    if (!isAuth && !isAuthLoading) {
      void router.push("/signin");
    }
  }, [session, isAuthLoading, isAuth, router]);

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
            {BLOGS.map((blog) => (
              <BlogEntry key={blog.title} {...blog} />
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
