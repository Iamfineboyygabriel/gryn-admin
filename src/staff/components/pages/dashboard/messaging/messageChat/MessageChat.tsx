import { useState, useEffect, useRef } from "react";
import profile from "../../../../../../assets/svg/Profile.svg";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";

interface Message {
  id: number | string;
  senderId: string;
  message: string;
  createdAt: string;
  sender?: {
    profile?: {
      avatar?: {
        publicURL?: string;
      };
      email?: string;
    };
  };
}

const MessageChat = () => {
  const {
    currentChat,
    messages: reduxMessages,
    loading,
    currentUserId,
    socketService,
  } = useMessage();

  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join chat room and listen for new messages
  useEffect(() => {
    // if (currentChat?.id) {
    //   socketService.emit("join_chat", { chatId: currentChat.id });
    // }

    const handleNewMessage = (newMessage: Message) => {
      setLocalMessages((prev) => [...prev, newMessage]);
    };

    socketService.on("new_message", handleNewMessage);

    return () => {
      socketService.off("new_message", handleNewMessage);
    };
  }, [currentChat?.id, socketService]);

  // Update local messages when redux messages change
  useEffect(() => {
    if (reduxMessages?.length) {
      setLocalMessages(reduxMessages as Message[]);
    }
  }, [reduxMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const formatMessageTime = (timestamp: string) => {
    try {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !currentChat?.id || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);
      const messageData = {
        senderId: currentUserId,
        message: trimmedMessage,
        createdAt: new Date().toISOString(),
        chatId: currentChat.id,
      };

      // Emit the message directly through socket
      // socketService.emit("send_message", {
      //   chatId: currentChat.id,
      //   message: messageData,
      // });

      // Optimistically add message to local state
      setLocalMessages((prev) => [...prev, { ...messageData, id: Date.now() }]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const otherUser = localMessages?.find(
    (msg: Message) => msg?.senderId !== currentUserId
  )?.sender;

  if (!currentChat) {
    return (
      <main className="h-screen w-full flex items-center justify-center rounded-xl bg-white p-4 dark:bg-gray-800 dark:text-white">
        <p>Select a chat to start messaging</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col rounded-xl bg-white p-4 dark:bg-gray-800 dark:text-white">
      <header className="flex-shrink-0">
        {otherUser && (
          <nav className="flex items-center gap-4 border-b-2 border-gray-100 py-3 dark:border-gray-700">
            <img
              src={otherUser?.profile?.avatar?.publicURL || profile}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="font-semibold">
              {otherUser?.profile?.email || "Unknown User"}
            </h1>
          </nav>
        )}
      </header>

      <section className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          <>
            {localMessages?.map((msg: Message) => (
              <div
                key={msg?.id}
                className={`flex gap-4 ${
                  msg?.senderId === currentUserId ? "flex-row-reverse" : ""
                }`}
              >
                {msg?.senderId !== currentUserId && (
                  <img
                    src={msg?.sender?.profile?.avatar?.publicURL || profile}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={`max-w-[50%] rounded-lg p-3 ${
                    msg?.senderId === currentUserId
                      ? "bg-purple-700 text-white ml-auto"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <p className="break-words">{msg?.message}</p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatMessageTime(msg?.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </section>

      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 border-t border-gray-100 pt-4 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-700 dark:text-white"
            disabled={sendingMessage}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendingMessage}
            className="rounded-full bg-purple-700 px-6 py-2 text-white disabled:opacity-50"
          >
            {sendingMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default MessageChat;
