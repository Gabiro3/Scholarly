"use client";

import { Smile } from "lucide-react";
import Picker from '@emoji-mart/react';
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  const handleSelectEmoji = (emoji: { native: string }) => {
    onChange(emoji.native); // Call the onChange prop with the selected emoji
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={10} // Adjusted for better positioning
        className="bg-transparent border-none shadow-none drop-shadow-none"
      >
        <Picker
          set='apple'
          data={data}
          onSelect={handleSelectEmoji}
          theme={resolvedTheme} // Ensure picker theme matches the current theme
        />
      </PopoverContent>
    </Popover>
  );
};




