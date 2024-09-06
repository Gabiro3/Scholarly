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
    <button type="button" className="p-2">
      <Smile />
    </button>
  </PopoverTrigger>

  <PopoverContent side="top" sideOffset={5}>
    <Picker
      data={data}
      onEmojiSelect={(emoji: any) => onChange(emoji.native)}
      theme="dark"
    />
  </PopoverContent>
</Popover>

  );
};




