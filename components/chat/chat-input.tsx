"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client"; // Import Socket.IO client and types
import axios from "axios"; // Import axios

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

  const [socket, setSocket] = useState<Socket | null>(null); // Manage the socket state with explicit type

  useEffect(() => {
    const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!); // Connect to the Socket.IO server
    setSocket(newSocket); // Set the socket instance

    return () => {
      newSocket.close(); // Clean up the socket connection
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  // Optimistically render the message and emit it via Socket.IO
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!socket) return; // Ensure the socket is available

    try {
      // Emit the message through the socket
      const messageData = {
        content: values.content,
        type,
        ...query, // Include query details (e.g., channel, conversation)
      };

      // Optimistically update the chat UI (message immediately appears)
      socket.emit("message", messageData);

      // Optionally send the message to your backend to persist in the DB
      const url = apiUrl; // URL for the POST request
      await axios.post(url, values);

      form.reset(); // Reset the form
      router.refresh(); // Refresh the page or chat to get latest messages
    } catch (error) {
      console.error(error);
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
