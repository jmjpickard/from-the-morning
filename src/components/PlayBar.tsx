import { Button } from "@/components/ui/button";
import { useSpotify } from "./Player";
import { DropdownFilter } from "./Dropdown";
import { PauseIcon, PlayIcon } from "lucide-react";

export const PlayBar: React.FC = () => {
  const spotify = useSpotify();
  const deviceOpts = spotify?.devices?.map((d) => ({
    value: d.id,
    label: d.name,
  }));
  const active = spotify?.activeDevice?.name ?? "None";
  const albumPhoto = spotify?.playbackState?.item?.album?.images[0]?.url;
  const trackName = spotify?.playbackState?.item?.name;
  const artist = spotify?.playbackState?.item?.artists[0]?.name;
  const trackUri = spotify?.playbackState?.item?.uri;
  const isPlaying = spotify?.playbackState?.is_playing;

  const handleDropdownSelect = (value: string) => {
    spotify?.setActiveDevice(value);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-600">
            {albumPhoto && <img src={albumPhoto} />}
          </div>
          <div>
            <p className="text-sm">{trackName ?? "Unknown track"}</p>
            <p className="text-xs text-gray-500">
              {artist ?? "Unknown artist"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isPlaying ? (
            <Button
              variant="ghost"
              onClick={() => spotify?.pause()}
              className="w-10 rounded-full px-1 py-1 text-white"
            >
              <PauseIcon className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => spotify?.play(trackUri ?? "")}
              className="w-10 rounded-full px-1 py-1 text-white"
            >
              <PlayIcon className="" />
            </Button>
          )}
        </div>
        <DropdownFilter
          options={deviceOpts ?? []}
          value={active}
          setValue={handleDropdownSelect}
        />
      </div>
    </div>
  );
};
