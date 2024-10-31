import profile from "../../../../../../assets/svg/Profile.svg";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";
import { useCurrentUser } from '../../../../../../shared/redux/hooks/shared/getUserProfile';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface Message {
  id: string;
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
  const { userDetails } = useCurrentUser();
  const { 
    currentChat, 
    messages: reduxMessages, 
    loading,
    handleSendMessage 
  } = useMessage();
  
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const currentUserId = userDetails?.data?.id;

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL || '', {
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socketRef.current.on('new_message', (newMessage: Message) => {
      setLocalMessages(prev => [...prev, newMessage]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (reduxMessages?.length) {
      setLocalMessages(reduxMessages);
    }
  }, [reduxMessages]);

  useEffect(() => {
    if (currentChat?.id && socketRef.current) {
      socketRef.current.emit('join_chat', { chatId: currentChat.id });
    }
  }, [currentChat?.id]);

  // Auto-scroll to bottom when new messages arrive
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [localMessages]);

  // Format timestamp with proper timezone handling
  const formatMessageTime = (timestamp: string) => {
    try {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return ''; 
      }
      
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message?.trim() || !currentChat?.id) {
      return;
    }

    try {
      setSendingMessage(true);
      
      // Create temporary message for optimistic update
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUserId || '',
        message: message.trim(),
        createdAt: new Date().toISOString(),
        sender: userDetails?.data
      };

      // Add to local messages immediately
      setLocalMessages(prev => [...prev, tempMessage]);
      
      const messageData = {
        message: message.trim(),
        timestamp: new Date().toISOString(),
        chatId: currentChat.id
      };
      
      await handleSendMessage(messageData);
      
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          chatId: currentChat.id,
          message: messageData
        });
      }

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setLocalMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    } finally {
      setSendingMessage(false);
    }
  };

  const otherUser = localMessages?.find((message: Message) => 
    message.senderId !== currentUserId
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
              src={otherUser.profile?.avatar?.publicURL || profile} 
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="font-semibold">{otherUser?.profile?.email || 'Unknown User'}</h1>
          </nav>
        )}
      </header>

      <section className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
        {loading && !localMessages.length ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          <>
            {localMessages.map((message: Message) => (
              <div
                key={message?.id}
                className={`flex gap-4 ${
                  message?.senderId === currentUserId ? 'flex-row-reverse' : ''
                }`}
              >
                {message.senderId !== currentUserId && (
                  <img 
                    src={message?.sender?.profile?.avatar?.publicURL || profile} 
                    alt="profile" 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                )}
                <div
                  className={`max-w-[50%] rounded-lg p-3 ${
                    message?.senderId === currentUserId
                      ? 'bg-purple-700 text-white ml-auto'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="break-words">{message?.message}</p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatMessageTime(message?.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </section>

      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-gray-100 pt-4 dark:border-gray-700">
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
            disabled={!message?.trim() || sendingMessage}
            className="rounded-full bg-purple-700 px-6 py-2 text-white disabled:opacity-50"
          >
            {sendingMessage ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default MessageChat;