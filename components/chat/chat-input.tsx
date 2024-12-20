"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-model-store";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const refi = useRef<HTMLTextAreaElement>(null);

  const sendSound = useRef<HTMLAudioElement | null>(null);
  const receiveSound = useRef<HTMLAudioElement | null>(null);

  // Load sounds
  if (!sendSound.current) sendSound.current = new Audio("/sounds/send.mp3");

  const playSound = (soundType: "send" | "receive") => {
    if (soundType === "send") sendSound.current?.play();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);
      form.reset();
      playSound("send"); // Play send sound
      router.refresh();
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>

                  <Textarea
                    disabled={isLoading}
                    autoFocus
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    ref={refi}
                    rows={1}
                  />

                  <button
                    type="submit"
                    className="absolute top-7 right-8 h-[24px] w-[24px] bg-blue-500 hover:bg-blue-600 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Send className="text-white" />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};



