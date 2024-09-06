"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Ensure the trigger is properly clickable */}
        <button type="button" className="p-2">
          <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={10}
        className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg"
      >
        <Picker
          data={data}
          theme={resolvedTheme} // Ensure the picker respects the current theme
          onEmojiSelect={(emoji: any) => onChange(emoji.native)} // Ensure emoji is passed
        />
      </PopoverContent>
    </Popover>
  );
};

