import { Button } from "@/components/ui/button";
import { PlayIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const NavBar: React.FC = () => {
  return (
    <div className="container flex flex-row items-center justify-around gap-2 py-8 sm:px-20 ">
      <div className="flex flex-col gap-2">
        <h3 className="cursor-pointer text-2xl font-extrabold sm:text-[2rem]">
          <Link href="/">From the morning</Link>
        </h3>
        <div>A music blog</div>
      </div>
      <Button variant="link" asChild>
        <Link className="text-lg" href="/about">
          About
        </Link>
      </Button>
      <div className="flex flex-col items-center gap-2">
        <Button size="icon">
          <PlayIcon className="h-7 w-7" />
        </Button>
        <span>Play all</span>
      </div>
    </div>
  );
};
