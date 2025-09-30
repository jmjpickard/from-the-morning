import { Button } from "@/components/ui/button";
import { useSpotify } from "./Player";
import { DropdownFilter } from "./Dropdown";
import { DeviceSelectionDialog } from "./DeviceSelectionDialog";
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  ShuffleIcon,
  RepeatIcon,
  Repeat1Icon,
  AlertCircleIcon,
} from "lucide-react";
import React from "react";

export const PlayBar: React.FC = () => {
  const spotify = useSpotify();
  const [volume, setVolumeState] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showDeviceDialog, setShowDeviceDialog] = React.useState(false);

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
  const shuffleState = spotify?.playbackState?.shuffle_state ?? false;
  const repeatState = spotify?.playbackState?.repeat_state ?? "off";
  const progressMs = spotify?.playbackState?.progress_ms ?? 0;
  const durationMs = spotify?.playbackState?.item?.duration_ms ?? 0;
  const hasActiveDevice = spotify?.hasActiveDevice ?? false;
  const needsDeviceSelection = spotify?.needsDeviceSelection ?? false;

  // Sync volume with device
  React.useEffect(() => {
    const deviceVolume = spotify?.activeDevice?.volume_percent;
    if (deviceVolume !== undefined && !isDragging) {
      setVolumeState(deviceVolume);
    }
  }, [spotify?.activeDevice?.volume_percent, isDragging]);

  const handleDropdownSelect = (value: string) => {
    spotify?.setActiveDevice(value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolumeState(newVolume);
    setIsDragging(true);
  };

  const handleVolumeChangeEnd = () => {
    setIsDragging(false);
    spotify?.setVolume(volume);
  };

  const handleShuffleToggle = () => {
    spotify?.toggleShuffle(!shuffleState);
  };

  const handleRepeatToggle = () => {
    const nextState =
      repeatState === "off"
        ? "context"
        : repeatState === "context"
          ? "track"
          : "off";
    spotify?.setRepeat(nextState);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    spotify?.seek(newPosition);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayClick = () => {
    // If no active device, show device selection dialog
    if (!hasActiveDevice) {
      setShowDeviceDialog(true);
      return;
    }
    // Otherwise, play the track
    spotify?.play(trackUri ?? "");
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
      <div className="fixed bottom-0 left-0 right-0 bg-primary p-4 text-white">
        <div className="flex flex-col space-y-2">
          {/* Device warning banner */}
          {needsDeviceSelection && (
            <div className="flex items-center space-x-2 rounded-md bg-yellow-500/20 px-3 py-2 text-sm">
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
              <span className="flex-1 text-yellow-200">
                No active device selected. Click the device icon to select one.
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeviceDialog(true)}
                className="h-6 text-xs text-yellow-200 hover:text-yellow-100"
              >
                Select Device
              </Button>
            </div>
          )}

          {/* Progress bar */}
          <div className="flex items-center space-x-2">
            <span className="text-xs">{formatTime(progressMs)}</span>
            <input
              type="range"
              min="0"
              max={durationMs}
              value={progressMs}
              onChange={handleSeek}
              className="flex-1"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${(progressMs / durationMs) * 100}%, #4a4a4a ${(progressMs / durationMs) * 100}%, #4a4a4a 100%)`,
              }}
            />
            <span className="text-xs">{formatTime(durationMs)}</span>
          </div>

        <div className="flex items-center justify-between">
          {/* Track info */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-600">
              {albumPhoto && <img src={albumPhoto} alt={trackName} />}
            </div>
            <div>
              <p className="text-sm">{trackName ?? "Unknown track"}</p>
              <p className="text-xs text-gray-500">
                {artist ?? "Unknown artist"}
              </p>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleShuffleToggle}
              className={`h-8 w-8 rounded-full px-1 py-1 ${shuffleState ? "text-green-500" : "text-white"}`}
              title="Toggle Shuffle"
            >
              <ShuffleIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => spotify?.skipPrevious()}
              className="h-8 w-8 rounded-full px-1 py-1 text-white"
              title="Previous"
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>

            {isPlaying ? (
              <Button
                variant="ghost"
                onClick={() => spotify?.pause()}
                className="h-10 w-10 rounded-full px-1 py-1 text-white"
                title="Pause"
              >
                <PauseIcon className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handlePlayClick}
                className={`h-10 w-10 rounded-full px-1 py-1 ${!hasActiveDevice ? "text-yellow-500 hover:text-yellow-400" : "text-white"}`}
                title={
                  !hasActiveDevice ? "Select a device to play" : "Play"
                }
              >
                <PlayIcon className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => spotify?.skipNext()}
              className="h-8 w-8 rounded-full px-1 py-1 text-white"
              title="Next"
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleRepeatToggle}
              className={`h-8 w-8 rounded-full px-1 py-1 ${repeatState !== "off" ? "text-green-500" : "text-white"}`}
              title={`Repeat: ${repeatState}`}
            >
              {repeatState === "track" ? (
                <Repeat1Icon className="h-4 w-4" />
              ) : (
                <RepeatIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Volume and device controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Volume2Icon className="h-4 w-4" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                onMouseUp={handleVolumeChangeEnd}
                onTouchEnd={handleVolumeChangeEnd}
                className="w-24"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #4a4a4a ${volume}%, #4a4a4a 100%)`,
                }}
              />
              <span className="text-xs">{volume}%</span>
            </div>

            <Button
              variant={needsDeviceSelection ? "destructive" : "secondary"}
              size="sm"
              className="h-8 border-dashed"
              onClick={() => setShowDeviceDialog(true)}
              title={
                needsDeviceSelection
                  ? "No device selected - Click to select"
                  : `Connected to ${active}`
              }
            >
              <span className="ml-2 flex flex-row font-mono text-xs">
                {active}
              </span>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
