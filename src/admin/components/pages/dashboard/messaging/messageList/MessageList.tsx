// import React, { useState, useRef, useEffect } from 'react';
// import { formatDistance } from 'date-fns';
// import { FiSearch } from "react-icons/fi";
// import { useMessage } from '../../../../../../shared/redux/hooks/shared/message';
// import profile from "../../../../../../assets/svg/Profile.svg";
// import noChat from "../../../../../../assets/svg/Transaction.svg"


// interface User {
//   id: string;
//   email: string;
// }

// interface Message {
//   content: string;
//   timestamp: string;
// }

// interface ChatUser {
//   email: string;
//   profilePic?: string;
// }

// interface Chat {
//   id: string;
//   user: ChatUser;
//   lastMessage?: Message;
//   unreadCount: number;
//   receiver:{
//     profile:{
//       avatar: string;
//       email: string;
//       profilePic?: string;
//     }
//   }
// }

// const MessageList: React.FC = () => {
//   const { 
//     chats, 
//     users,
//     // loading, 
//     search, 
//     handleSearch, 
//     selectedChatId,
//     handleCreateChat 
//   } = useMessage();
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);

//   const formatMessageTime = (timestamp: string) => {
//     return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef?.current && !searchRef?.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document?.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleUserSelect = async (userId: string) => {
//     try {
//       await handleCreateChat(userId);
//       setShowSuggestions(false);
//     } catch (error) {
//     }
//   };

//   const renderContent = () => {
//     // if (loading) {
//     //   return <div className="text-center text-gray-500">Loading chats...</div>;
//     // }

//     if (!chats || chats?.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center mt-12">
//           <img src={noChat} alt="No chats" className="w-48 h-48 opacity-50" />
//           <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
//             No chats available. Start a conversation by searching for users above.
//           </p>
//         </div>
//       );
//     }

//     return chats?.map((chat: any) => (
//       <div 
//       className={`flex cursor-pointer gap-2 rounded-lg p-2 ${
//         selectedChatId === chat?.id ? 'bg-gray-100 dark:bg-gray-700' : ''
//       }`}
//       key={chat?.id}
//       onClick={() => handleUserSelect(chat?.receiverId)}

//     >
//         <img 
//           src={chat?.receiver?.profile?.avatar?.publicURL || profile} 
//           alt="profile_pic"
//           className="h-12 w-12 rounded-full"
//         />
//         <div className="flex flex-1 flex-col gap-1">
//           <h1 className="font-semibold">{chat?.receiver?.profile?.email}</h1>
//           <p className="font-light text-gray-500 dark:text-gray-300">
//             {chat?.messages[0]?.message || 'No messages yet'}
//           </p>
//           <small className="text-primary-700 dark:text-gray-400">
//             {chat?.lastMessage ? formatMessageTime(chat?.lastMessage?.timestamp) : ''}
//           </small>
//         </div>
//         {chat?.unreadCount > 0 && (
//           <span className="ml-auto h-fit rounded-full bg-primary-700 px-2 py-1 text-xs text-white">
//             {chat?.unreadCount}
//           </span>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <main className="h-screen w-[39%] overflow-y-auto rounded-xl bg-white p-[1em] font-outfit dark:bg-gray-800 dark:text-white">
//       <section ref={searchRef} className="relative w-full">
//         <input
//           type="text"
//           className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm dark:bg-gray-700 dark:text-white"
//           placeholder="Search users by email"
//           value={search}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//             handleSearch(e.target.value);
//             setShowSuggestions(true);
//           }}
//           onFocus={() => setShowSuggestions(true)}
//         />
//         <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
        
//         {showSuggestions && search && users && users?.length > 0 && (
//           <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-700">
//             <ul className="max-h-60 overflow-auto py-1">
//               {users?.map((user: User) => (
//                 <li
//                   key={user?.id}
//                   className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
//                   onClick={() => handleUserSelect(user?.id)}
//                 >
//                   <div className="flex items-center">
//                     <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-500" />
//                     <span className="ml-3">{user?.email}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </section>

//       <section>
//         <div className="mt-[2em] flex flex-col gap-[1.2em]">
//           {renderContent()}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default MessageList;


import React, { useState, useRef, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { FiSearch } from "react-icons/fi";
import { useMessage } from '../../../../../../shared/redux/hooks/shared/message';
import profile from "../../../../../../assets/svg/Profile.svg";
import noChat from "../../../../../../assets/svg/Transaction.svg"

interface User {
  id: string;
  email: string;
}

interface Message {
  id: number;
  message: string;
  chatId: string;
  senderId: string;
  read: boolean;
  createdAt: string;
}

interface Avatar {
  publicURL?: string;
  id?: number;
  userProfileId?: number;
  s3Key?: string;
  s3Region?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface Profile {
  email: string;
  avatar: Avatar | null;
}

interface ChatUser {
  id: string;
  profile: Profile;
}

interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  sender: ChatUser;
  receiver: ChatUser;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const MessageList = () => {
  const { 
    chats = [], 
    users = [], 
    search = '', 
    handleSearch, 
    selectedChatId,
    handleCreateChat 
  } = useMessage();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const handleUserSelect = async (userId: string) => {
    if (!userId) return;
    try {
      await handleCreateChat(userId);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const getLastMessage = (messages: Message[] | undefined): Message | null => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) return null;
    return messages[messages.length - 1];
  };

  const getUnreadCount = (messages: Message[] | undefined, currentUserId: string | undefined): number => {
    if (!messages || !Array.isArray(messages) || !currentUserId) return 0;
    return messages.filter(msg => !msg.read && msg.senderId !== currentUserId).length;
  };

  const getOtherUser = (chat: Chat, currentUserId: string | undefined): ChatUser | null => {
    if (!chat || !currentUserId) return null;
    return chat.senderId === currentUserId ? chat.receiver : chat.sender;
  };

  const renderContent = () => {
    if (!Array.isArray(chats) || chats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="w-48 h-48 bg-gray-200 rounded-full" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            No chats available. Start a conversation by searching for users above.
          </p>
        </div>
      );
    }

    const currentUserId = chats[0]?.senderId;
    const uniqueChats = new Map<string, Chat>();
    
    chats.forEach((chat: any) => {
      const otherUser = getOtherUser(chat, currentUserId);
      if (!otherUser) return; // Skip if we can't determine the other user
      
      const lastMessageCurrent = getLastMessage(chat.messages);
      const existingChat = uniqueChats.get(otherUser.id);
      const lastMessageExisting = existingChat ? getLastMessage(existingChat.messages) : null;

      if (!existingChat || 
          (lastMessageCurrent && lastMessageExisting && 
           new Date(lastMessageCurrent.createdAt) > new Date(lastMessageExisting.createdAt))) {
        uniqueChats.set(otherUser.id, chat);
      }
    });

    return Array.from(uniqueChats.values()).map((chat: Chat) => {
      const otherUser = getOtherUser(chat, currentUserId);
      if (!otherUser) return null; // Skip rendering if we can't determine the other user
      
      const lastMessage = getLastMessage(chat.messages);
      const unreadCount = getUnreadCount(chat.messages, currentUserId);

      return (
        <div 
          className={`flex cursor-pointer gap-2 rounded-lg p-2 ${
            selectedChatId === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
          key={chat.id}
          onClick={() => handleUserSelect(otherUser.id)}
        >
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            {otherUser.profile?.avatar?.publicURL && (
              <img 
                src={otherUser.profile.avatar.publicURL || profile}
                alt="profile"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          
          <div className="flex flex-1 flex-col gap-1">
            <h1 className="font-semibold">{otherUser.profile?.email || 'Unknown User'}</h1>
            <p className="font-light text-gray-500 dark:text-gray-300">
              {lastMessage?.message || 'No messages yet'}
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
    });
  };

  return (
    <main className="h-screen w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 font-outfit dark:bg-gray-800 dark:text-white">
      <section ref={searchRef} className="relative w-full">
        <input
          type="text"
          className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-12 text-sm dark:bg-gray-700 dark:text-white"
          placeholder="Search users by email"
          value={search}
          onChange={(e) => {
            handleSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
        
        {showSuggestions && search && users.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-700">
            <ul className="max-h-60 overflow-auto py-1">
              {users.map((user: User) => (
                <li
                  key={user.id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleUserSelect(user.id)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-500" />
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
          {renderContent()}
        </div>
      </section>
    </main>
  );
};

export default MessageList;