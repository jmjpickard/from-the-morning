import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownFilter } from "./Dropdown";
import { useSpotify } from "./Player";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "./UserNav";

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
      <UserNav />
    </div>
  );
};
