"use client"
import { Fragment, useRef, ElementRef, useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { io as ClientIO } from "socket.io-client";  // Import socket.io-client

import { useChatQuery } from "@/hooks/use-chat-query";
import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import CustomDateSeparator from "@/components/date-separator";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  // State for messages coming from API and Socket
  const [messages, setMessages] = useState<MessageWithMemberWithProfile[]>([]);

  // Fetch old messages from the API
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // Handle scrolling
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  // Connect to Socket.IO and listen for new messages
  useEffect(() => {
    const socket = ClientIO(socketUrl, { query: socketQuery });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    // Listen for new messages
    socket.on("new_message", (newMessage: MessageWithMemberWithProfile) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [socketUrl, socketQuery]);

  // Merge old API messages with new socket messages
  useEffect(() => {
    if (data) {
      const oldMessages = data.pages.flatMap((page) => page.items);
      setMessages((prevMessages) => [...oldMessages, ...prevMessages]);
    }
  }, [data]);

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {messages
          .filter((message) => message.content !== "This message has been deleted.")
          .map((message, index, arr) => {
            const messageDate = new Date(message.createdAt);
            const previousMessageDate =
              index > 0 ? new Date(arr[index - 1].createdAt) : null;
            const showDateSeparator =
              !previousMessageDate || !isSameDay(messageDate, previousMessageDate);

            return (
              <Fragment key={message.id}>
                {showDateSeparator && <CustomDateSeparator date={messageDate} />}
                <ChatItem
                  id={message.id}
                  currentMember={member}
                  member={message.member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.delete}
                  timestamp={format(messageDate, DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              </Fragment>
            );
          })}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

