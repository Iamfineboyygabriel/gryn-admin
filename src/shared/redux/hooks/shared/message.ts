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

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const pendingMessages = useRef<Set<string>>(new Set());
  const lastMessageTimestamp = useRef<string>('');

  const cleanup = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  }, []);

  // Initialize chat data and polling
  useEffect(() => {
    dispatch(fetchAllUserChats());
    dispatch(fetchUnreadCount());

    // Set up periodic polling for new messages and unread count
    pollInterval.current = setInterval(() => {
      if (selectedChatId) {
        dispatch(fetchChatByUserId(selectedUserId as string));
      }
      dispatch(fetchUnreadCount());
    }, 5000); // Poll every 5 seconds

    return cleanup;
  }, [dispatch, selectedChatId, selectedUserId, cleanup]);

  // Handle chat selection and message fetching
  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchChatByUserId(selectedUserId));
      lastMessageTimestamp.current = new Date().toISOString();
    }
  }, [selectedUserId, dispatch]);

  // Optimized chat selection handler
  const handleChatSelect = useCallback((chatId: string, userId: string) => {
    setSelectedChatId(chatId);
    setSelectedUserId(userId);
    pendingMessages.current.clear();
    lastMessageTimestamp.current = new Date().toISOString();
  }, []);

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      dispatch(setSearch(searchTerm));
      dispatch(searchUser(searchTerm));
    }, 300),
    [dispatch]
  );

  const handleCreateChat = useCallback(
    async (userId: string) => {
      try {
        const result = await dispatch(createChat(userId)).unwrap();
        handleChatSelect(result.id, userId);
        return result;
      } catch (error) {
        console.error('Failed to create chat:', error);
        throw error;
      }
    },
    [dispatch, handleChatSelect]
  );

  // Enhanced message sending with optimistic updates
  const handleSendMessage = useCallback(
    async (messageData: { message: string; timestamp: string }) => {
      if (!currentChat?.id) {
        throw new Error('No active chat selected');
      }

      // Generate temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      pendingMessages.current.add(tempId);

      try {
        // Optimistically add message to state
        const optimisticMessage = {
          id: tempId,
          chatId: currentChat.id,
          content: messageData.message,
          timestamp: messageData.timestamp,
          status: 'sending',
        };

        // Send the actual message
        const result = await dispatch(
          sendMessage({
            chatId: currentChat.id,
            body: messageData,
          })
        ).unwrap();

        pendingMessages.current.delete(tempId);
        return result;
      } catch (error) {
        pendingMessages.current.delete(tempId);
        throw error;
      }
    },
    [currentChat?.id, dispatch]
  );

  // Batch message read status updates
  const handleMarkAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!selectedChatId || messageIds.length === 0) return;

      try {
        await dispatch(
          updateReadStatus({
            chatId: selectedChatId,
            body: { messageIds },
          })
        ).unwrap();
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    },
    [selectedChatId, dispatch]
  );

  // Memoized message processing
  const processedMessages = useCallback(() => {
    const validMessages = messages.filter(
      (msg) => !pendingMessages.current.has(msg.id)
    );
    return validMessages;
  }, [messages]);

  return {
    users,
    chats,
    currentChat,
    messages: processedMessages(),
    loading,
    error,
    unreadCount,
    search,
    selectedChatId,
    selectedUserId,
    setSelectedChatId,
    setSelectedUserId,
    handleChatSelect,
    handleSearch,
    handleCreateChat,
    handleSendMessage,
    handleMarkAsRead,
  };
};