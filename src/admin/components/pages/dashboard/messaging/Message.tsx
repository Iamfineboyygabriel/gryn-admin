import MessageChat from "./messageChat/MessageChat";
import MessageList from "./messageList/MessageList";

const Message = () => {
  return (
    <main>
      <h1 className="text-2xl font-outfit font-bold">Messaging / Inbox</h1>
      <div className="mt-[1em] flex gap-[1em]">
        <MessageList />
        <MessageChat />
      </div>
    </main>
  );
};

export default Message;
