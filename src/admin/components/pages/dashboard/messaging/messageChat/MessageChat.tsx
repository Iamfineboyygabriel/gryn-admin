import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";
import socket from "../../../../../../socket/socket";
import profile from "../../../../../../assets/svg/Profile.svg";
import { AppDispatch } from "../../../../../../shared/redux/store";
import { updateReadStatus } from "../../../../../../shared/redux/shared/slices/message.slices";

interface User {
  id: string;
  email: string;
  profile: {
    email: string;
    avatar?: {
      publicURL?: string;
    };
  };
}

interface Message {
  id: number | string;
  senderId: string;
  message: string;
  createdAt: string;
  sender: User;
  read: boolean;
}

interface Chat {
  id: string;
  sender: User;
  receiver: User;
  messages: Message[];
}

const MessageChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useCurrentUser();
  const { currentChat, messages: reduxMessages, loading } = useMessage();
  const [message, setMessage] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = userDetails?.data?.id || "";

  // Centralized sorting function with better date parsing
  const sortMessagesByDate = useCallback((messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => {
      try {
        // Handle both timestamp formats and ensure proper parsing
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        // Fallback to ID-based sorting if dates are invalid or equal
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return Number(a.id) - Number(b.id);
        }

        const timeDiff = dateA.getTime() - dateB.getTime();
        if (timeDiff === 0) {
          // If timestamps are identical, use ID as tiebreaker
          return Number(a.id) - Number(b.id);
        }

        return timeDiff;
      } catch (error) {
        console.error("Error sorting messages:", error);
        return Number(a.id) - Number(b.id);
      }
    });
  }, []);

  // Memoized sorted messages
  const sortedMessages = useMemo(() => {
    return sortMessagesByDate(localMessages);
  }, [localMessages, sortMessagesByDate]);

  // Handle socket events
  useEffect(() => {
    const handleReceiveMessage = (newMessage: Message) => {
      setLocalMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(
          (msg) =>
            msg.id === newMessage.id ||
            (msg.message === newMessage.message &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(newMessage.createdAt).getTime()
              ) < 1000)
        );

        if (messageExists) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    const handleConnectError = (error: any) => {
      console.error("Socket connection error:", error.message);
      setError("Failed to connect to server. Please try again.");
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  // Join chat room and update read status
  useEffect(() => {
    if (currentChat?.id && currentUserId) {
      socket.emit("joinChat", currentChat.id);
      dispatch(updateReadStatus({ chatId: currentChat.id, currentUserId }));
    }
  }, [currentChat?.id, currentUserId, dispatch]);

  // Initialize messages from current chat or redux messages
  useEffect(() => {
    let messagesToSet: Message[] = [];

    if (currentChat?.messages?.length) {
      console.log(
        "Setting messages from currentChat:",
        currentChat.messages.length
      );
      messagesToSet = currentChat.messages;
    } else if (reduxMessages?.length) {
      console.log("Setting messages from redux:", reduxMessages.length);
      messagesToSet = reduxMessages as Message[];
    }

    if (messagesToSet.length > 0) {
      // Remove duplicates based on ID
      const uniqueMessages = messagesToSet.filter(
        (msg, index, self) => self.findIndex((m) => m.id === msg.id) === index
      );

      setLocalMessages(uniqueMessages);
    } else {
      setLocalMessages([]);
    }
  }, [currentChat?.messages, reduxMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message?.trim() || !currentChat?.id) return;

    try {
      setSendingMessage(true);
      socket.emit("sendMessage", {
        chatId: currentChat.id,
        message: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (timestamp: string): string => {
    try {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const messageDate = new Date(timestamp);
      const isToday = now.toDateString() === messageDate.toDateString();

      if (isToday) {
        return new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date);
      } else {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date);
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const otherUser = sortedMessages.find(
    (msg: Message) => msg.senderId !== currentUserId
  )?.sender;

  if (error) {
    return (
      <main className="h-screen w-full flex items-center justify-center rounded-xl bg-white p-4 dark:bg-gray-800 dark:text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!currentChat) {
    return (
      <main className="h-screen w-full flex items-center justify-center rounded-xl bg-white p-4 dark:bg-gray-800 dark:text-white">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col rounded-xl bg-white dark:bg-gray-800 dark:text-white">
      <header className="flex-shrink-0 p-4">
        {otherUser && (
          <nav className="flex items-center gap-4 border-b-2 border-gray-100 py-3 dark:border-gray-700">
            <img
              src={otherUser.profile.avatar?.publicURL || profile}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = profile;
              }}
            />
            <div>
              <h1 className="font-semibold">
                {otherUser.profile.email || "Unknown User"}
              </h1>
              <p className="text-sm text-gray-500">
                {sortedMessages.length} message
                {sortedMessages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </nav>
        )}
      </header>

      <section className="flex-1 flex flex-col gap-4 py-4 px-4 overflow-y-auto">
        {loading && sortedMessages.length === 0 ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start a conversation!
          </div>
        ) : (
          sortedMessages.map((msg, index) => {
            const isCurrentUser = msg.senderId === currentUserId;
            const showAvatar =
              !isCurrentUser &&
              (index === 0 ||
                sortedMessages[index - 1]?.senderId !== msg.senderId);

            return (
              <div
                key={`${msg.id}-${index}`}
                className={`flex gap-3 ${
                  isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-8 flex-shrink-0">
                  {showAvatar && (
                    <img
                      src={msg.sender?.profile?.avatar?.publicURL || profile}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = profile;
                      }}
                    />
                  )}
                </div>

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-purple-700 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser
                        ? "text-purple-200"
                        : "text-gray-500 dark:text-gray-400"
                    } ${isCurrentUser ? "text-right" : "text-left"}`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Auto-scroll to bottom */}
        <div id="messages-end" />
      </section>

      <div className="flex-shrink-0 border-t border-gray-100 p-4 dark:border-gray-700">
        <PrivateElement feature="MESSAGINGS" page="Send/Inbox">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 px-4 py-2 border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              disabled={sendingMessage}
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!message?.trim() || sendingMessage}
              className="rounded-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 px-6 py-2 text-white transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {sendingMessage ? "..." : "Send"}
            </button>
          </form>
        </PrivateElement>
      </div>
    </main>
  );
};

export default MessageChat;
