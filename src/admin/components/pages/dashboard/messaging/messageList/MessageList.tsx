import React, { useState, useRef, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { FiSearch } from "react-icons/fi";
import { useMessage } from '../../../../../../shared/redux/hooks/shared/message';
import profile from "../../../../../../assets/svg/Profile.svg";
import noChat from "../../../../../../assets/svg/Transaction.svg"

interface User {
  id: string;
  email: string;
  profile?: {
    email: string;
    avatar: Avatar | null;
  };
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

interface Message {
  id: number | string;
  message: string;
  chatId: string;
  senderId: string;
  read: boolean;
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

interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    profile: {
      email: string;
      avatar: Avatar | null;
    };
  };
  receiver: {
    id: string;
    profile: {
      email: string;
      avatar: Avatar | null;
    };
  };
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
    handleCreateChat,
    currentUserId,
  } = useMessage();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localChats, setLocalChats] = useState<Chat[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Array.isArray(chats)) {
      const validChats = chats.filter(chat => 
        chat.sender && chat.receiver && 
        (chat.messages.length > 0 || 
         chat.sender.id === currentUserId || 
         chat.receiver.id === currentUserId)
      );
      
      const sortedChats = validChats.sort((a:any, b:any) => {
        const aLatest = a.messages.length > 0 
          ? new Date(a.messages[a.messages.length - 1].createdAt).getTime()
          : new Date(a.createdAt).getTime();
        const bLatest = b.messages.length > 0
          ? new Date(b.messages[b.messages.length - 1].createdAt).getTime()
          : new Date(b.createdAt).getTime();
        return bLatest - aLatest;
      });

      setLocalChats(sortedChats);
    }
  }, [chats, currentUserId]);

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
      const result = await handleCreateChat(userId);
      setShowSuggestions(false);
      if (result && !localChats.find(chat => chat.id === result.id)) {
        setLocalChats(prev => [result, ...prev]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const getLastMessage = (chat: Chat): Message | null => {
    return chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
  };

  const getUnreadCount = (chat: Chat): number => {
    return chat.messages.filter(msg => !msg.read && msg?.senderId !== currentUserId).length;
  };

  const getOtherUser = (chat: Chat) => {
    return chat?.sender?.id === currentUserId ? chat?.receiver : chat?.sender;
  };

  const renderContent = () => {
    if (localChats.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="w-48 h-48 bg-gray-200 rounded-full" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            No chats available. Start a conversation by searching for users above.
          </p>
        </div>
      );
    }

    return localChats.map((chat) => {
      const otherUser = getOtherUser(chat);
      const lastMessage = getLastMessage(chat);
      const unreadCount = getUnreadCount(chat);

      return (
        <div
          key={chat.id}
          className={`flex cursor-pointer gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
            selectedChatId === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
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
            <p className="font-light text-gray-500 dark:text-gray-300 text-sm">
              {lastMessage?.message || 'Start a conversation'}
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
