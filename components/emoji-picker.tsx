"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
console.log(data);
interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-2"
          aria-label="Open emoji picker"
        >
          <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={10}
        className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg w-80 h-72"
      >
        <Picker
          data={data} // Emoji data imported from the package
          onEmojiSelect={(emoji: any) => onChange(emoji.native)} // Changed to get the native emoji
          theme="dark" // Optional: You can dynamically apply themes here based on your app
        />
      </PopoverContent>
    </Popover>
  );
};




