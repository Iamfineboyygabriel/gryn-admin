import React, { useState, useRef, useEffect, useMemo } from "react";
import { formatDistance } from "date-fns";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";
import profile from "../../../../../../assets/svg/Profile.svg";
import { AppDispatch } from "../../../../../../shared/redux/store";
import {
  messageRead,
  updateReadStatus,
} from "../../../../../../shared/redux/shared/slices/message.slices";

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
  message: string;
  senderId: string;
  read: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  sender: User;
  receiver: User;
  messages: Message[];
  createdAt: string;
  unreadCount: number;
}

const MessageList: React.FC = () => {
  const {
    chats = [],
    users = [],
    search = "",
    handleSearch,
    selectedChatId,
    handleCreateChat,
    currentUserId,
    socketService,
  } = useMessage();
  const dispatch = useDispatch<AppDispatch>();
  const [localSearch, setLocalSearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [localChats, setLocalChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize search
  useEffect(() => {
    handleSearch("");
    setLocalSearch("");
    return () => {
      handleSearch("");
      setLocalSearch("");
    };
  }, [handleSearch]);

  useEffect(() => {
    if (localSearch === "" && search !== "") {
      setLocalSearch(search);
    }
  }, [search, localSearch]);

  // Handle socket events
  useEffect(() => {
    socketService.on(
      "new_message",
      (data: { chatId: string; message: Message }) => {
        setLocalChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === data.chatId
              ? { ...chat, messages: [...chat.messages, data.message] }
              : chat,
          ),
        );
      },
    );

    socketService.on(
      "message_read",
      (data: { chatId: string; userId: string }) => {
        console.log("Received message_read:", data);
        dispatch(messageRead(data));
        setLocalChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === data.chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) => ({
                    ...msg,
                    read: msg.read || msg.senderId === data.userId,
                  })),
                  unreadCount: 0,
                }
              : chat,
          ),
        );
      },
    );

    return () => {
      socketService.off("new_message");
      socketService.off("message_read");
    };
  }, [socketService, dispatch]);

  // Sort and filter chats
  const sortedChats = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    const validChats = chats.filter(
      (chat) =>
        chat.sender &&
        chat.receiver &&
        (chat.messages.length > 0 ||
          chat.sender.id === currentUserId ||
          chat.receiver.id === currentUserId),
    );
    return validChats.sort((a, b) => {
      const aLatest = a.messages.length
        ? new Date(a.messages[a.messages.length - 1].createdAt).getTime()
        : new Date(a.createdAt).getTime();
      const bLatest = b.messages.length
        ? new Date(b.messages[b.messages.length - 1].createdAt).getTime()
        : new Date(b.createdAt).getTime();
      return bLatest - aLatest;
    });
  }, [chats, currentUserId]);

  useEffect(() => {
    setLocalChats(sortedChats);
  }, [sortedChats]);

  // Handle clicks outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatMessageTime = (timestamp: string): string => {
    if (!timestamp) return "";
    try {
      return formatDistance(new Date(timestamp), new Date(), {
        addSuffix: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const getOtherUser = (chat: Chat): User => {
    return chat.sender.id === currentUserId ? chat.receiver : chat.sender;
  };

  const getUnreadCount = (chat: Chat): number => {
    return chat.messages.filter(
      (msg) => !msg.read && msg.senderId !== currentUserId,
    ).length;
  };

  const handleUserSelect = async (userId: string) => {
    if (!userId || !currentUserId) return;
    try {
      const existingChat = localChats.find(
        (chat) =>
          (chat.sender.id === userId && chat.receiver.id === currentUserId) ||
          (chat.sender.id === currentUserId && chat.receiver.id === userId),
      );

      if (existingChat) {
        dispatch(updateReadStatus({ chatId: existingChat.id, currentUserId }));
        return handleCreateChat(userId);
      }

      const newChat = await handleCreateChat(userId);
      setShowSuggestions(false);
      setLocalSearch("");
      handleSearch("");
      return newChat;
    } catch (error) {
      console.error("Error handling user selection:", error);
      setError("Failed to select chat. Please try again.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    handleSearch(value);
    setShowSuggestions(true);
  };

  if (error) {
    console.error("Error in MessageList:", error);
    return (
      <main className="h-screen w-full max-w-md rounded-xl bg-white p-4 font-outfit dark:bg-gray-800 dark:text-white">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 font-outfit dark:bg-gray-800 dark:text-white">
      <section ref={searchRef} className="relative w-full">
        <input
          type="text"
          className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-12 text-sm dark:bg-gray-700 dark:text-white"
          placeholder="Search users by email"
          value={localSearch}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
        />
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />

        {showSuggestions && localSearch && users.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-700">
            <ul className="max-h-60 overflow-auto py-1">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={user?.profile?.avatar?.publicURL || profile}
                      alt="profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="ml-3">{user.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-4">
          {localChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-12">
              <img
                src={profile}
                alt="No chats"
                className="w-48 h-48 rounded-full opacity-50"
              />
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
                No chats available. Start a conversation by searching for users
                above.
              </p>
            </div>
          ) : (
            localChats.map((chat) => {
              const otherUser = getOtherUser(chat);
              const lastMessage = chat.messages[chat.messages.length - 1];
              const unreadCount = getUnreadCount(chat);

              return (
                <div
                  key={chat.id}
                  className={`flex cursor-pointer gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedChatId === chat.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => handleUserSelect(otherUser.id)}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={otherUser.profile.avatar?.publicURL || profile}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <h1 className="font-semibold">
                      {otherUser.profile.email || "Unknown User"}
                    </h1>
                    <p className="font-light text-gray-500 dark:text-gray-300 text-sm truncate">
                      {lastMessage?.message || "Start a conversation"}
                    </p>
                    {lastMessage && (
                      <small className="text-primary-700 dark:text-gray-400">
                        {formatMessageTime(lastMessage.createdAt)}
                      </small>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <span className="ml-auto h-fit rounded-full bg-primary-700 px-2 py-1 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

export default MessageList;
