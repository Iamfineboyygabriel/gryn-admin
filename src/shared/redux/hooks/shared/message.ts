import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  searchUser, 
  createChat,
  fetchChatById,
  fetchAllUserChats,
  sendMessage,
  updateReadStatus,
  fetchUnreadCount,
  selectMessageState,
  setSearch
}  from '../../shared/slices/message.slices';
import { AppDispatch } from '../../store';


interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  profilePic: string;
}

interface Chat {
  id: string;
  user: ChatUser;
  lastMessage?: Message;
  unreadCount: number;
  timestamp: string;
}

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
    search 
  } = useSelector(selectMessageState);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching initial chat data');
    dispatch(fetchAllUserChats());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    if (selectedChatId) {
      console.log('Fetching messages for chat:', selectedChatId);
      dispatch(fetchChatById(selectedChatId));
    }
  }, [selectedChatId, dispatch]);

  const handleSearch = useCallback((searchTerm: string) => {
    console.log('Searching users with term:', searchTerm);
    dispatch(setSearch(searchTerm));
    dispatch(searchUser(searchTerm));
  }, [dispatch]);

  // Create new chat
  const handleCreateChat = useCallback(async (userId: string) => {
    console.log('Creating new chat with user:', userId);
    try {
      const result = await dispatch(createChat(userId)).unwrap();
      console.log('Chat created:', result);
      setSelectedChatId(result.id);
      return result;
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    }
  }, [dispatch]);

  // Send message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedChatId) return;
    
    console.log('Sending message in chat:', selectedChatId);
    const messageData = {
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await dispatch(sendMessage({
        chatId: selectedChatId,
        body: messageData
      })).unwrap();
      console.log('Message sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [selectedChatId, dispatch]);

  const handleMarkAsRead = useCallback(async (messageIds: string[]) => {
    if (!selectedChatId) return;
    
    console.log('Marking messages as read:', messageIds);
    try {
      await dispatch(updateReadStatus({
        chatId: selectedChatId,
        body: { messageIds }
      })).unwrap();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [selectedChatId, dispatch]);

  return {
    users,
    chats,
    currentChat,
    messages,
    loading,
    error,
    unreadCount,
    search,
    selectedChatId,

    setSelectedChatId,
    handleSearch,
    handleCreateChat,
    handleSendMessage,
    handleMarkAsRead,
  };
};
