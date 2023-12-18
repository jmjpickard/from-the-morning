import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

import React from "react";
import { BlogEntry } from "~/components/BlogEntry";
import { NavBar } from "~/components/NavBar";
import { useSpotify } from "~/components/Player";

const BLOGS = [
  {
    title: "Nick Drake - From the morning",
    content: "From the morning, from the morning, from the morning",
    trackId: "6meH4I9A4WZtD3z8hnQKqr",
  },
];

const Home: NextPage = () => {
  const session = useSession();
  const isAuth =
    session.status === "authenticated" || session.status === "loading";

  const router = useRouter();
  React.useEffect(() => {
    if (!isAuth) {
      router.push("/signin");
    }
  }, [session, router]);

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
          <>
            {BLOGS.map((blog) => (
              <BlogEntry key={blog.title} {...blog} />
            ))}
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        ) : (
          <p>Redirecting...</p>
        )}
      </main>
    </>
  );
};

export default Home;
