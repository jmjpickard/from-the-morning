import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LaptopIcon, SmartphoneIcon, SpeakerIcon } from "lucide-react";
import { PlaybackDevice } from "./Player";

interface DeviceSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devices: PlaybackDevice[];
  onSelectDevice: (deviceId: string) => void;
  isLoading?: boolean;
}

export const DeviceSelectionDialog: React.FC<DeviceSelectionDialogProps> = ({
  open,
  onOpenChange,
  devices,
  onSelectDevice,
  isLoading = false,
}) => {
  const getDeviceIcon = (type: string) => {
    const deviceType = type.toLowerCase();
    if (deviceType.includes("computer")) {
      return <LaptopIcon className="h-6 w-6" />;
    } else if (deviceType.includes("smartphone") || deviceType.includes("phone")) {
      return <SmartphoneIcon className="h-6 w-6" />;
    } else {
      return <SpeakerIcon className="h-6 w-6" />;
    }
  };

  const handleSelectDevice = (deviceId: string) => {
    onSelectDevice(deviceId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Device</DialogTitle>
          <DialogDescription>
            Choose a Spotify device to play music. Make sure Spotify is open on
            at least one device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <SpeakerIcon className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">No devices found</p>
                <p className="text-sm text-muted-foreground">
                  Open Spotify on your computer, phone, or speaker to see
                  available devices.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                size="sm"
              >
                Refresh
              </Button>
            </div>
          ) : (
            devices.map((device) => (
              <Button
                key={device.id}
                variant={device.is_active ? "default" : "outline"}
                className="flex h-auto items-center justify-start space-x-3 p-4"
                onClick={() => handleSelectDevice(device.id)}
                disabled={isLoading}
              >
                <div className="flex-shrink-0">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="font-medium">{device.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {device.type}
                    {device.is_active && " • Active"}
                  </span>
                </div>
                {device.volume_percent !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {device.volume_percent}%
                  </span>
                )}
              </Button>
            ))
          )}
        </div>
        {devices.length > 0 && (
          <div className="text-center text-xs text-muted-foreground">
            Tip: You can also select a device from the device icon in the player
            controls
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};