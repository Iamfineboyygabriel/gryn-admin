import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import {
  searchUser,
  createChat,
  fetchChatByUserId,
  fetchAllUserChats,
  sendMessage,
  updateReadStatus,
  fetchUnreadCount,
  selectMessageState,
  setSearch,
} from '../../shared/slices/message.slices';
import { AppDispatch } from '../../store';
import { useCurrentUser } from './getUserProfile';

export const useMessage = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    users,
    chats,
    currentChat,
    messages,
    loading,
    error,
    unreadCount,
    search,
  } = useSelector(selectMessageState);

  const { userDetails } = useCurrentUser();
  const currentUserId = userDetails?.data?.id;

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [localChats, setLocalChats] = useState<any[]>([]);

  // Initialize chats and polling
  useEffect(() => {
    dispatch(fetchAllUserChats());
    dispatch(fetchUnreadCount());

    const interval = setInterval(() => {
      dispatch(fetchAllUserChats());
      dispatch(fetchUnreadCount());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Update local chats when redux chats change
  useEffect(() => {
    if (Array.isArray(chats)) {
      setLocalChats(chats);
    }
  }, [chats]);

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      dispatch(setSearch(searchTerm));
      if (searchTerm.trim()) {
        dispatch(searchUser(searchTerm));
      }
    }, 300),
    [dispatch]
  );

  const handleCreateChat = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(createChat(userId)).unwrap();
        setSelectedChatId(result.id);
        setSelectedUserId(userId);
        
        // Update local chats immediately
        setLocalChats(prev => {
          const exists = prev.some(chat => chat.id === result.id);
          if (!exists) {
            return [result, ...prev];
          }
          return prev;
        });
        
        return result;
      } catch (error) {
        console.error('Failed to create chat:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const handleSendMessage = useCallback(
    async (messageData: { message: string; timestamp: string; chatId: string }) => {
      try {
        const result = await dispatch(
          sendMessage({
            chatId: messageData.chatId,
            body: messageData,
          })
        ).unwrap();

        // Update local chats immediately for better UX
        setLocalChats(prev => {
          return prev.map(chat => {
            if (chat.id === messageData.chatId) {
              return {
                ...chat,
                messages: [...chat.messages, result]
              };
            }
            return chat;
          });
        });

        return result;
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },
    [dispatch]
  );

  return {
    users,
    chats: localChats,
    currentChat,
    messages,
    loading,
    error,
    unreadCount,
    search,
    selectedChatId,
    selectedUserId,
    currentUserId,
    handleSearch,
    handleCreateChat,
    handleSendMessage,
  };
};