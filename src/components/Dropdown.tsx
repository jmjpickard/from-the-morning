import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LaptopIcon } from "@radix-ui/react-icons";

interface DropdownFilterProps {
  options?: {
    value: string;
    label: string;
  }[];
  value: string;
  setValue: (value: string) => void;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  value,
  setValue,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={value === "None" ? "destructive" : "secondary"}
          role="combobox"
          aria-expanded={open}
          size="sm"
          className="h-8 border-dashed"
        >
          <LaptopIcon className="h-4 w-4 lg:mr-2" />
          <span className="ml-2 flex hidden flex-row font-mono text-xs lg:block">
            {value}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {options?.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                }}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    value === option.value
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <CheckIcon className={cn("h-4 w-4")} />
                </div>
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
