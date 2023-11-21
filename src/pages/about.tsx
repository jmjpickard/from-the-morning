import { NavBar } from "~/components/NavBar";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background font-mono text-foreground">
      <NavBar />
      <div>About this website</div>
    </main>
  );
}
