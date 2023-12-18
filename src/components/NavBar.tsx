import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownFilter } from "./Dropdown";
import { useSpotify } from "./Player";

export const NavBar: React.FC = () => {
  const spotify = useSpotify();
  const deviceOpts = spotify?.devices?.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  const active = spotify?.activeDevice?.name ?? "None";
  const handleDropdownSelect = (value: string) => {
    console.log("changed", value);
    spotify?.setActiveDevice(value);
  };
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
        <DropdownFilter
          options={deviceOpts ?? []}
          value={active}
          setValue={handleDropdownSelect}
        />
      </div>
    </div>
  );
};
