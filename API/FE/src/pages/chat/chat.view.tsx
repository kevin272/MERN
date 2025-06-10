import React, { useState, useEffect, useRef } from 'react';

// Define a simple message interface for dummy data
interface Message {
  id: string;
  sender: 'user' | 'other'; // 'user' is the current logged-in user, 'other' is the person they are chatting with
  text: string;
  timestamp: string;
}

// Define a simple chat user interface
interface ChatUser {
  id: string;
  name: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  unreadCount: number;
  profilePic: string; // Placeholder for profile picture URL
}

export const ChatViewPage: React.FC = () => {
  // Dummy messages for initial display - these will be associated with the selected chat user
  const initialMessages: { [key: string]: Message[] } = {
    'user1': [
      { id: '1', sender: 'other', text: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
      { id: '2', sender: 'user', text: 'Hi there! I have a question about campaigns.', timestamp: '10:01 AM' },
      { id: '3', sender: 'other', text: 'Certainly, what would you like to know?', timestamp: '10:02 AM' },
    ],
    'user2': [
      { id: '4', sender: 'other', text: 'Hey, checking in on the new donation feature.', timestamp: 'Yesterday' },
      { id: '5', sender: 'user', text: 'It\'s live! Let me know if you have any feedback.', timestamp: 'Yesterday' },
    ],
    'user3': [
      { id: '6', sender: 'other', text: 'Good morning, just wanted to say thanks!', timestamp: 'Mon' },
      { id: '7', sender: 'user', text: 'Anytime! Happy to help.', timestamp: 'Mon' },
      { id: '8', sender: 'other', text: 'I appreciate your quick response.', timestamp: 'Mon' },
    ],
  };

  // Dummy chat users for the chat list
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    { id: 'user1', name: 'Alice Smith', lastMessagePreview: 'Certainly, what would you like...', lastMessageTime: '10:02 AM', unreadCount: 0, profilePic: 'https://placehold.co/100x100/A0DAA9/FFFFFF?text=AS' },
    { id: 'user2', name: 'Bob Johnson', lastMessagePreview: 'It\'s live! Let me know...', lastMessageTime: 'Yesterday', unreadCount: 2, profilePic: 'https://placehold.co/100x100/81C784/FFFFFF?text=BJ' },
    { id: 'user3', name: 'Charlie Brown', lastMessagePreview: 'I appreciate your quick response.', lastMessageTime: 'Mon', unreadCount: 0, profilePic: 'https://placehold.co/100x100/66BB6A/FFFFFF?text=CB' },
    { id: 'user4', name: 'Diana Prince', lastMessagePreview: 'New campaign proposal...', lastMessageTime: 'Last Week', unreadCount: 1, profilePic: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=DP' },
  ]);

  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(chatUsers[0] || null);
  const [messages, setMessages] = useState<Message[]>(selectedChatUser ? initialMessages[selectedChatUser.id] || [] : []);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the latest message

  // Effect to update messages when a new chat user is selected
  useEffect(() => {
    if (selectedChatUser) {
      setMessages(initialMessages[selectedChatUser.id] || []);
      // Mark messages as read when selected
      setChatUsers(prevUsers => prevUsers.map(user =>
        user.id === selectedChatUser.id ? { ...user, unreadCount: 0 } : user
      ));
    } else {
      setMessages([]);
    }
  }, [selectedChatUser]);

  // Effect to scroll to the bottom of the messages list on new message or initial load
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChatUser) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');

      // Optionally, update the last message preview for the selected user in the chat list
      setChatUsers(prevUsers => prevUsers.map(user =>
        user.id === selectedChatUser.id ? {
          ...user,
          lastMessagePreview: newMsg.text,
          lastMessageTime: newMsg.timestamp,
        } : user
      ));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-800">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-4 bg-emerald-700 text-white font-bold text-xl rounded-tl-2xl">Chats</div>
        <div className="flex-grow overflow-y-auto">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200
                ${selectedChatUser?.id === user.id ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedChatUser(user)}
            >
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-emerald-300"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600 truncate">{user.lastMessagePreview}</p>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-500">
                <span>{user.lastMessageTime}</span>
                {user.unreadCount > 0 && (
                  <span className="mt-1 bg-emerald-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {user.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] md:h-[85vh] border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-emerald-700 text-white p-4 rounded-t-2xl shadow-md flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {selectedChatUser ? `Chat with ${selectedChatUser.name}` : 'Select a chat'}
            </h2>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {selectedChatUser ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-75 mt-1 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation from the left sidebar to start chatting.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedChatUser ? "Type your message..." : "Select a chat to type"}
                className="flex-grow py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                disabled={!selectedChatUser}
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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

export default ChatViewPage;
