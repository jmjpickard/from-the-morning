import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSpotify } from "./Player";
import { Button } from "@/components/ui/button";
import { api } from "~/utils/api";
import type { Track } from "~/types/track";
import { PlayIcon, AlertCircleIcon } from "lucide-react";
import { PauseIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { DeviceSelectionDialog } from "./DeviceSelectionDialog";
import React from "react";

interface BlogProps {
  content: string;
  trackId: string;
  index?: number;
}

const getArtistNames = (track?: Track) => {
  return track?.artists?.map((artist) => artist.name).join(", ");
};

export const BlogEntry: React.FC<BlogProps> = ({ content, trackId, index }: BlogProps) => {
  const spotify = useSpotify();
  const [showDeviceDialog, setShowDeviceDialog] = React.useState(false);

  const track = api.player.getTrack.useQuery({
    trackId,
    accessToken: spotify?.accessToken ?? "",
  });
  const trackName = track.data?.name;
  const artists = getArtistNames(track.data);
  const albumImage = track.data?.album?.images
    ? track.data?.album.images[0]?.url
    : "";

  const isPlaying = spotify?.playbackState?.is_playing;
  const isPlayingTrack = spotify?.playbackState?.item?.uri === `spotify:track:${trackId}`;
  const hasActiveDevice = spotify?.hasActiveDevice ?? false;

  const handlePlayClick = () => {
    // If no active device, show device selection dialog
    if (!hasActiveDevice) {
      setShowDeviceDialog(true);
      return;
    }
    // Otherwise, play the track
    if (index !== undefined) {
      spotify?.playFromQueue(index);
    } else {
      spotify?.play(`spotify:track:${trackId}`);
    }
  };

  const handleDeviceSelect = (deviceId: string) => {
    spotify?.setActiveDevice(deviceId);
  };

  return (
    <>
      <DeviceSelectionDialog
        open={showDeviceDialog}
        onOpenChange={setShowDeviceDialog}
        devices={spotify?.devices ?? []}
        onSelectDevice={handleDeviceSelect}
        isLoading={spotify?.setActiveIsLoading}
      />
      <Card className="ml-4 mr-4 w-auto sm:w-2/3">
        <CardHeader className="flex justify-between gap-3 lg:flex-row lg:gap-10">
          <div className="lg:flex lg:flex-row lg:gap-10">
            {albumImage && (
              <Image
                className="h-21 sm:h-40"
                src={albumImage}
                alt={trackName ?? "Album cover"}
                width={160}
                height={160}
              />
            )}

            <div className="mt-5 flex flex-col items-start gap-3">
              <div>
                <CardTitle>{trackName ?? "Unknown track"}</CardTitle>
                <CardDescription>{artists ?? "Unknown artist"}</CardDescription>
              </div>
              <div>
                <p>{content}</p>
              </div>
            </div>
          </div>
          {isPlaying && isPlayingTrack ? (
            <Button
              variant="ghost"
              onClick={() => spotify?.pause()}
              className="w-10 rounded-full px-1 py-1 text-primary"
            >
              <PauseIcon className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handlePlayClick}
              className={`w-10 rounded-full px-1 py-1 ${!hasActiveDevice ? "text-yellow-500" : "text-primary"}`}
              title={!hasActiveDevice ? "Select a device to play" : "Play"}
            >
              {!hasActiveDevice ? (
                <AlertCircleIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </Button>
          )}
        </CardHeader>
      </Card>
    </>
  );
};
