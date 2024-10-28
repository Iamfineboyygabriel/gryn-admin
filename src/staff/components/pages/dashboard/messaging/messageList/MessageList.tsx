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
  content: string;
  timestamp: string;
}

interface ChatUser {
  email: string;
  profilePic?: string;
}

interface Chat {
  id: string;
  user: ChatUser;
  lastMessage?: Message;
  unreadCount: number;
}

const MessageList: React.FC = () => {
  const { 
    chats, 
    users,
    loading, 
    search, 
    handleSearch, 
    selectedChatId,
    setSelectedChatId,
    handleCreateChat 
  } = useMessage();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const formatMessageTime = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef?.current && !searchRef?.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = async (userId: string) => {
    try {
      await handleCreateChat(userId);
      setShowSuggestions(false);
    } catch (error) {
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Loading chats...</div>;
    }

    if (!chats || chats?.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-12">
          <img src={noChat} alt="No chats" className="w-48 h-48 opacity-50" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            No chats available. Start a conversation by searching for users above.
          </p>
        </div>
      );
    }

    return chats?.map((chat: Chat) => (
      <div 
        className={`flex cursor-pointer gap-2 rounded-lg p-2 ${
          selectedChatId === chat?.id ? 'bg-gray-100 dark:bg-gray-700' : ''
        }`}
        key={chat.id}
        onClick={() => setSelectedChatId(chat.id)}
      >
        <img 
          src={chat.user.profilePic || profile} 
          alt="profile_pic"
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="font-semibold">{chat?.user?.email}</h1>
          <p className="font-light text-gray-500 dark:text-gray-300">
            {chat.lastMessage?.content || 'No messages yet'}
          </p>
          <small className="text-primary-700 dark:text-gray-400">
            {chat.lastMessage ? formatMessageTime(chat?.lastMessage?.timestamp) : ''}
          </small>
        </div>
        {chat?.unreadCount > 0 && (
          <span className="ml-auto h-fit rounded-full bg-primary-700 px-2 py-1 text-xs text-white">
            {chat?.unreadCount}
          </span>
        )}
      </div>
    ));
  };

  return (
    <main className="h-screen w-[39%] overflow-y-auto rounded-xl bg-white p-[1em] font-outfit dark:bg-gray-800 dark:text-white">
      <section ref={searchRef} className="relative w-full">
        <input
          type="text"
          className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm dark:bg-gray-700 dark:text-white"
          placeholder="Search users by email"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
        
        {showSuggestions && search && users && users.length > 0 && (
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

      <section>
        <div className="mt-[2em] flex flex-col gap-[1.2em]">
          {renderContent()}
        </div>
      </section>
    </main>
  );
};

export default MessageList;