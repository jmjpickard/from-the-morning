import Head from "next/head";
import { BlogEntry } from "~/components/BlogEntry";
import { NavBar } from "~/components/NavBar";

const BLOGS = [
  {
    title: "Nick Drake - From the morning",
    content: "From the morning, from the morning, from the morning",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>From the morning</title>
        <meta name="description" content="From the morning music blog" />
        <link rel="icon" href="/icons8-play-ios-16-32.ico" />
      </Head>
      <main className="bg-background text-foreground flex min-h-screen flex-col items-center font-mono">
        <NavBar />
        {BLOGS.map((blog) => (
          <BlogEntry key={blog.title} {...blog} />
        ))}
      </main>
    </>
  );
}
