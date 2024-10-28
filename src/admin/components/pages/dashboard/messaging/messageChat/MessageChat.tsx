import { useState } from 'react';
import profile from "../../../../../../assets/svg/Profile.svg";
import { useMessage } from "../../../../../../shared/redux/hooks/shared/message";

const MessageChat = () => {
  const { 
    currentChat, 
    messages, 
    loading,
    handleSendMessage 
  } = useMessage();
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await handleSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!currentChat) {
    return (
      <main className="h-screen w-full flex items-center justify-center rounded-xl bg-white p-[1em] dark:bg-gray-800 dark:text-white">
        <p>Select a chat to start messaging</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full overflow-y-auto rounded-xl bg-white p-[1em] dark:bg-gray-800 dark:text-white">
      <header>
        <nav className="flex items-center gap-[1em] border-b-[2px] border-gray-100 py-3 dark:border-gray-700">
         {/* <img 
            src={currentChat.user.profilePic || profile} 
            alt="profile_Pic"
            className="w-12 h-12 rounded-full"
          /> */}
          <h1 className="font-semibold">{currentChat?.user?.email}</h1> 
        </nav>
      </header>

      <section className="flex flex-col gap-4 py-4 h-[calc(100vh-200px)] overflow-y-auto">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          messages.map((message:any) => (
            <div
              key={message?.id}
              className={`flex gap-[1em] ${
                message?.senderId === 'currentUser' ? 'flex-row-reverse' : ''
              }`}
            >
              {message?.senderId !== 'currentUser' && (
                <img src={profile} alt="profile_pic" className="w-8 h-8 rounded-full" />
              )}
              <div
                className={`max-w-[50%] rounded-lg p-2 ${
                  message.senderId === 'currentUser'
                    ? 'bg-primary-700 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <small>{message.content}</small>
              </div>
            </div>
          ))
        )}
      </section>

      <form onSubmit={handleSubmit} className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newMessage?.trim()}
            className="rounded-full bg-primary-700 px-6 py-2 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
};

export default MessageChat;