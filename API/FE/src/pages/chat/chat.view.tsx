import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../../config/chat.config';
import { RootState } from '../../config/store.config';
import chatService from './chat.service';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isGuest?: boolean;
}

interface ChatUser {
  _id: string;
  guestId: string;
  guestName: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

const ChatViewPage: React.FC = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch admin's conversation list
  const fetchChatUsers = async () => {
    setLoadingChats(true);
    try {
      const users = await chatService.getAdminConversations();
      const mapped = users.map((u: any) => ({
        ...u,
        lastMessageTimestamp: new Date(u.lastMessageTimestamp).toLocaleString(),
        createdAt: new Date(u.createdAt).toLocaleString(),
        updatedAt: new Date(u.updatedAt).toLocaleString(),
        profilePic: `https://placehold.co/100x100/66BB6A/FFFFFF?text=${(u.guestName?.[0] || 'U').toUpperCase()}`,
      }));
      setChatUsers(mapped);
    } catch (err: any) {
      setChatError(err.message || 'Failed to load chats.');
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessagesByConversationId(conversationId);
      setMessages(msgs.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      })));
    } catch (err: any) {
      setChatError(err.message || 'Failed to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.role !== 'admin') {
      setChatError('Access Denied: Not an admin.');
      return;
    }

    fetchChatUsers();
    socket.connect();

    socket.emit('joinRoom', 'admin_inbox', loggedInUser._id);

    socket.on('newGuestMessageNotification', (data) => {
      fetchChatUsers();
      if (selectedChatUser?._id === data.conversationId) {
        fetchMessages(data.conversationId);
      }
    });

    socket.on('messageUpdateNotification', (data) => {
      if (selectedChatUser?._id === data.conversationId) {
        fetchMessages(data.conversationId);
      }
    });

    return () => {
      socket.disconnect();
      socket.off('newGuestMessageNotification');
      socket.off('messageUpdateNotification');
    };
  }, [loggedInUser, selectedChatUser]);

  useEffect(() => {
    if (selectedChatUser) {
      fetchMessages(selectedChatUser._id);
      setChatUsers((prev) =>
        prev.map((user) =>
          user._id === selectedChatUser._id ? { ...user, unreadCount: 0 } : user
        )
      );
    } else {
      setMessages([]);
    }
  }, [selectedChatUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatUser) return;

    const text = newMessage.trim();

    try {
      const messagePayload = {
        conversationId: selectedChatUser._id,
        senderId: loggedInUser!._id,
        senderName: loggedInUser!.name,
        text,
        isGuest: false,
      };

      await chatService.sendMessage(messagePayload);
      setNewMessage('');

      setMessages((prev) => [
        ...prev,
        {
          _id: 'temp-' + Date.now(),
          senderId: loggedInUser!._id,
          senderName: loggedInUser!.name,
          text,
          timestamp: new Date().toLocaleString(),
          isGuest: false,
        },
      ]);

      setChatUsers((prev) =>
        prev.map((u) =>
          u._id === selectedChatUser._id
            ? { ...u, lastMessageText: text, lastMessageTimestamp: new Date().toISOString() }
            : u
        )
      );
    } catch (err: any) {
      setChatError(err.message || 'Failed to send message.');
    }
  };

  if (loadingChats) {
    return <CenteredMessage text="Loading chats..." />;
  }

  if (chatError) {
    return <CenteredMessage text={chatError} isError />;
  }

  if (loggedInUser?.role !== 'admin') {
    return <CenteredMessage text="Access Denied: You must be an administrator." isError />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-800">
      {/* Sidebar */}
      <Sidebar
        chatUsers={chatUsers}
        selectedChatUser={selectedChatUser}
        onSelect={setSelectedChatUser}
      />

      {/* Chat Main Area */}
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 rounded-t-2xl shadow-md">
            <h2 className="text-xl font-bold">
              {selectedChatUser ? `Chat with ${selectedChatUser.guestName}` : 'Select a chat'}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {loadingMessages ? (
              <CenteredMessage text="Loading messages..." />
            ) : selectedChatUser ? (
              messages.map((msg) => (
                <MessageBubble key={msg._id} msg={msg} isAdmin={msg.senderId === loggedInUser!._id} />
              ))
            ) : (
              <CenteredMessage text="Select a conversation to start chatting." />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedChatUser ? 'Type your message...' : 'Select a chat to type'}
                className="flex-grow py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                disabled={!selectedChatUser}
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={!selectedChatUser}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper components
const CenteredMessage = ({ text, isError = false }: { text: string; isError?: boolean }) => (
  <div className={`flex justify-center items-center h-screen ${isError ? 'bg-red-50' : 'bg-gray-50'}`}>
    <p className={`text-lg ${isError ? 'text-red-700 font-bold' : 'text-gray-600'}`}>{text}</p>
  </div>
);

const MessageBubble = ({ msg, isAdmin }: { msg: Message; isAdmin: boolean }) => (
  <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
        isAdmin
          ? 'bg-emerald-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}
    >
      <p className="text-sm">
        <strong>{msg.senderName}:</strong> {msg.text}
      </p>
      <span className="text-xs opacity-75 mt-1 block text-right">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
);

const Sidebar = ({
  chatUsers,
  selectedChatUser,
  onSelect,
}: {
  chatUsers: ChatUser[];
  selectedChatUser: ChatUser | null;
  onSelect: (user: ChatUser) => void;
}) => (
  <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
    <div className="p-4 bg-emerald-700 text-white font-bold text-xl rounded-tl-2xl">Active Chats</div>
    <div className="flex-grow overflow-y-auto">
      {chatUsers.length > 0 ? (
        chatUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelect(user)}
            className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              selectedChatUser?._id === user._id ? 'bg-emerald-50' : 'hover:bg-gray-50'
            }`}
          >
            <img
              src={user.profilePic}
              alt={user.guestName}
              className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-emerald-300"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{user.guestName}</h3>
              <p className="text-sm text-gray-600 truncate">{user.lastMessageText}</p>
            </div>
            <div className="flex flex-col items-end text-xs text-gray-500">
              <span>
                {new Date(user.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {user.unreadCount > 0 && (
                <span className="mt-1 bg-emerald-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {user.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No active chats.</div>
      )}
    </div>
  </div>
);

export default ChatViewPage;
