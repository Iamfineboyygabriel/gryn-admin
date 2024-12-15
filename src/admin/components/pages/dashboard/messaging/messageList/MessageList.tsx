// import React, { useState, useRef, useEffect } from "react";
// import { formatDistance } from "date-fns";
// import { FiSearch } from "react-icons/fi";
// import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";
// import profile from "../../../../../../assets/svg/Profile.svg";

// interface User {
//   id: string;
//   email: string;
//   profile?: {
//     email: string;
//     avatar?: {
//       publicURL?: string;
//     };
//   };
// }

// interface Message {
//   id: number | string;
//   message: string;
//   senderId: string;
//   read: boolean;
//   createdAt: string;
// }

// interface Chat {
//   id: string;
//   sender: {
//     id: string;
//     profile: {
//       email: string;
//       avatar?: {
//         publicURL?: string;
//       };
//     };
//   };
//   receiver: {
//     id: string;
//     profile: {
//       email: string;
//       avatar?: {
//         publicURL?: string;
//       };
//     };
//   };
//   messages: Message[];
//   createdAt: string;
// }

// const MessageList = () => {
//   const {
//     chats = [],
//     users = [],
//     search = "",
//     handleSearch,
//     selectedChatId,
//     handleCreateChat,
//     currentUserId,
//     socketService,
//   } = useMessage();

//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [sortedChats, setSortedChats] = useState<any>([]);
//   const [localChats, setLocalChats] = useState<any>([]);
//   const searchRef = useRef<HTMLDivElement>(null);

//   // Initialize socket listeners for chat updates
//   useEffect(() => {
//     socketService.on(
//       "new_message",
//       (data: { chatId: string; message: Message }) => {
//         setLocalChats((prevChats: any) => {
//           return prevChats.map((chat: any) => {
//             if (chat.id === data.chatId) {
//               return {
//                 ...chat,
//                 messages: [...chat.messages, data.message],
//               };
//             }
//             return chat;
//           });
//         });
//       }
//     );

//     socketService.on(
//       "message_read",
//       (data: { chatId: string; userId: string }) => {
//         setLocalChats((prevChats: any) => {
//           return prevChats.map((chat: any) => {
//             if (chat.id === data.chatId) {
//               return {
//                 ...chat,
//                 messages: chat.messages.map((msg: any) => ({
//                   ...msg,
//                   read: msg.read || msg.senderId === data.userId,
//                 })),
//               };
//             }
//             return chat;
//           });
//         });
//       }
//     );

//     return () => {
//       socketService.off("new_message");
//       socketService.off("message_read");
//     };
//   }, [socketService]);

//   // Update local chats when redux chats change
//   useEffect(() => {
//     if (Array.isArray(chats)) {
//       const validChats = chats.filter(
//         (chat) =>
//           chat.sender &&
//           chat.receiver &&
//           (chat.messages.length > 0 ||
//             chat.sender.id === currentUserId ||
//             chat.receiver.id === currentUserId)
//       );

//       const sorted = validChats.sort((a: any, b: any) => {
//         const aLatest = a.messages.length
//           ? new Date(a.messages[a.messages.length - 1].createdAt).getTime()
//           : new Date(a.createdAt).getTime();
//         const bLatest = b.messages.length
//           ? new Date(b.messages[b.messages.length - 1].createdAt).getTime()
//           : new Date(b.createdAt).getTime();
//         return bLatest - aLatest;
//       });

//       setSortedChats(sorted);
//       setLocalChats(sorted);
//     }
//   }, [chats, currentUserId]);

//   // Handle clicks outside search suggestions
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const formatMessageTime = (timestamp: string) => {
//     if (!timestamp) return "";
//     try {
//       return formatDistance(new Date(timestamp), new Date(), {
//         addSuffix: true,
//       });
//     } catch (error) {
//       console.error("Error formatting time:", error);
//       return "";
//     }
//   };

//   const getOtherUser = (chat: Chat) => {
//     return chat?.sender?.id === currentUserId ? chat?.receiver : chat?.sender;
//   };

//   const getUnreadCount = (chat: Chat): number => {
//     return chat.messages.filter(
//       (msg) => !msg.read && msg.senderId !== currentUserId
//     ).length;
//   };

//   const handleUserSelect = async (userId: string) => {
//     console.log("userId", userId);
//     if (!userId) return;

//     try {
//       // Check if chat already exists
//       const existingChat = localChats.find(
//         (chat: any) =>
//           (chat.sender.id === userId && chat.receiver.id === currentUserId) ||
//           (chat.sender.id === currentUserId && chat.receiver.id === userId)
//       );

//       if (existingChat) {
//         // If chat exists, mark messages as read
//         // socketService.emit("mark_messages_read", {
//         //   chatId: existingChat.id,
//         //   userId: currentUserId,
//         // });
//         return handleCreateChat(userId); // Pass userId instead of chat.id
//       }

//       // If chat doesn't exist, create new chat
//       const newChat = await handleCreateChat(userId); // Already passing userId
//       setShowSuggestions(false);

//       // Join the new chat room
//       // socketService.emit("join_chat", { chatId: newChat.id });

//       return newChat;
//     } catch (error) {
//       console.error("Error handling user selection:", error);
//     }
//   };

//   const debouncedSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     handleSearch(value);
//     setShowSuggestions(true);
//   };

//   return (
//     <main className="h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 font-outfit dark:bg-gray-800 dark:text-white">
//       <section ref={searchRef} className="relative w-full">
//         <input
//           type="text"
//           className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-12 text-sm dark:bg-gray-700 dark:text-white"
//           placeholder="Search users by email"
//           value={search}
//           onChange={debouncedSearch}
//           onFocus={() => setShowSuggestions(true)}
//         />
//         <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />

//         {showSuggestions && search && users.length > 0 && (
//           <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-700">
//             <ul className="max-h-60 overflow-auto py-1">
//               {users.map((user: User) => (
//                 <li
//                   key={user.id}
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   onClick={() => handleUserSelect(user.id)}
//                 >
//                   <div className="flex items-center">
//                     <img
//                       src={user.profile?.avatar?.publicURL || profile}
//                       alt="profile"
//                       className="h-8 w-8 rounded-full object-cover"
//                     />
//                     <span className="ml-3">{user.email}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </section>

//       <section className="mt-8">
//         <div className="flex flex-col gap-4">
//           {localChats.length === 0 ? (
//             <div className="flex flex-col items-center justify-center mt-12">
//               <img
//                 src={profile}
//                 alt="No chats"
//                 className="w-48 h-48 rounded-full opacity-50"
//               />
//               <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
//                 No chats available. Start a conversation by searching for users
//                 above.
//               </p>
//             </div>
//           ) : (
//             localChats.map((chat: any) => {
//               const otherUser = getOtherUser(chat);
//               const lastMessage = chat.messages[chat.messages.length - 1];
//               const unreadCount = getUnreadCount(chat);

//               return (
//                 <div
//                   key={chat.id}
//                   className={`flex cursor-pointer gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
//                     selectedChatId === chat.id
//                       ? "bg-gray-100 dark:bg-gray-700"
//                       : ""
//                   }`}
//                   onClick={() => handleUserSelect(otherUser.id)}
//                 >
//                   <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
//                     <img
//                       src={otherUser.profile?.avatar?.publicURL || profile}
//                       alt="profile"
//                       className="h-full w-full object-cover"
//                     />
//                   </div>

//                   <div className="flex flex-1 flex-col gap-1">
//                     <h1 className="font-semibold">
//                       {otherUser.profile?.email || "Unknown User"}
//                     </h1>
//                     <p className="font-light text-gray-500 dark:text-gray-300 text-sm truncate">
//                       {lastMessage?.message || "Start a conversation"}
//                     </p>
//                     {lastMessage && (
//                       <small className="text-primary-700 dark:text-gray-400">
//                         {formatMessageTime(lastMessage.createdAt)}
//                       </small>
//                     )}
//                   </div>

//                   {unreadCount > 0 && (
//                     <span className="ml-auto h-fit rounded-full bg-primary-700 px-2 py-1 text-xs text-white">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default MessageList;

import React, { useState, useRef, useEffect } from "react";
import { formatDistance } from "date-fns";
import { FiSearch } from "react-icons/fi";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";
import profile from "../../../../../../assets/svg/Profile.svg";

interface User {
  id: string;
  email: string;
  profile?: {
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
  sender: {
    id: string;
    profile: {
      email: string;
      avatar?: {
        publicURL?: string;
      };
    };
  };
  receiver: {
    id: string;
    profile: {
      email: string;
      avatar?: {
        publicURL?: string;
      };
    };
  };
  messages: Message[];
  createdAt: string;
}

const MessageList = () => {
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

  // Add local search state to handle immediate updates
  const [localSearch, setLocalSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortedChats, setSortedChats] = useState<any>([]);
  const [localChats, setLocalChats] = useState<any>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleSearch("");
    setLocalSearch("");

    return () => {
      handleSearch("");
      setLocalSearch("");
    };
  }, []);
  // Initialize local search only on first render
  useEffect(() => {
    if (localSearch === "" && search !== "") {
      setLocalSearch(search);
    }
  }, []);

  useEffect(() => {
    socketService.on(
      "new_message",
      (data: { chatId: string; message: Message }) => {
        setLocalChats((prevChats: any) => {
          return prevChats.map((chat: any) => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                messages: [...chat.messages, data.message],
              };
            }
            return chat;
          });
        });
      }
    );

    socketService.on(
      "message_read",
      (data: { chatId: string; userId: string }) => {
        setLocalChats((prevChats: any) => {
          return prevChats.map((chat: any) => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                messages: chat.messages.map((msg: any) => ({
                  ...msg,
                  read: msg.read || msg.senderId === data.userId,
                })),
              };
            }
            return chat;
          });
        });
      }
    );

    return () => {
      socketService.off("new_message");
      socketService.off("message_read");
    };
  }, [socketService]);

  // Update local chats when redux chats change
  useEffect(() => {
    if (Array.isArray(chats)) {
      const validChats = chats.filter(
        (chat) =>
          chat.sender &&
          chat.receiver &&
          (chat.messages.length > 0 ||
            chat.sender.id === currentUserId ||
            chat.receiver.id === currentUserId)
      );

      const sorted = validChats.sort((a: any, b: any) => {
        const aLatest = a.messages.length
          ? new Date(a.messages[a.messages.length - 1].createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bLatest = b.messages.length
          ? new Date(b.messages[b.messages.length - 1].createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return bLatest - aLatest;
      });

      setSortedChats(sorted);
      setLocalChats(sorted);
    }
  }, [chats, currentUserId]);

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

  const formatMessageTime = (timestamp: string) => {
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

  const getOtherUser = (chat: Chat) => {
    return chat?.sender?.id === currentUserId ? chat?.receiver : chat?.sender;
  };

  const getUnreadCount = (chat: Chat): number => {
    return chat.messages.filter(
      (msg) => !msg.read && msg.senderId !== currentUserId
    ).length;
  };

  const handleUserSelect = async (userId: string) => {
    if (!userId) return;

    try {
      // Check if chat already exists
      const existingChat = localChats.find(
        (chat: any) =>
          (chat.sender.id === userId && chat.receiver.id === currentUserId) ||
          (chat.sender.id === currentUserId && chat.receiver.id === userId)
      );

      if (existingChat) {
        return handleCreateChat(userId);
      }

      const newChat = await handleCreateChat(userId);
      setShowSuggestions(false);
      // Clear search after selecting a user
      setLocalSearch("");
      handleSearch("");
      return newChat;
    } catch (error) {
      console.error("Error handling user selection:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    handleSearch(value);
    setShowSuggestions(true);
  };

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
              {users.map((user: User) => (
                <li
                  key={user.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={user.profile?.avatar?.publicURL || profile}
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
            localChats.map((chat: any) => {
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
                      src={otherUser.profile?.avatar?.publicURL || profile}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <h1 className="font-semibold">
                      {otherUser.profile?.email || "Unknown User"}
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
