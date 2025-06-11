import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../config/chat.config'; // Still used for notifications/joining rooms
import { useSelector } from "react-redux";
import { RootState } from "../../config/store.config";
import chatService from './chat.service'; // Import the chat service for API calls

interface Message {
  _id: string; // MongoDB document ID
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string; // Stored as ISO string, converted to readable string for display
  isGuest?: boolean;
}

interface ChatUser {
  _id: string; // MongoDB document ID (for conversation)
  guestId: string; // The ID of the guest in this conversation
  guestName: string;
  lastMessageText: string;
  lastMessageTimestamp: string; // Stored as ISO string, converted for display
  unreadCount: number; // This would need backend implementation to track per admin
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

export const ChatViewPage: React.FC = () => {
  const loggedInUser = useSelector((state: RootState) => state.auth.loggedInUser);

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Function to fetch chat users from the backend
  const fetchChatUsers = async () => {
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      setChatError("Access Denied: Not an admin.");
      setLoadingChats(false);
      return;
    }
    setLoadingChats(true);
    try {
      const users = await chatService.getAdminConversations();
      // Map timestamps to Date objects for consistent sorting
      const mappedUsers = users.map((user: any) => ({
        ...user,
        lastMessageTimestamp: new Date(user.lastMessageTimestamp).toLocaleString(), // Convert to locale string for display
        createdAt: new Date(user.createdAt).toLocaleString(),
        updatedAt: new Date(user.updatedAt).toLocaleString(),
        profilePic: `https://placehold.co/100x100/66BB6A/FFFFFF?text=${(user.guestName?.charAt(0) || 'U').toUpperCase()}`,
      }));
      setChatUsers(mappedUsers);
      console.log("Fetched chat users from MongoDB:", users.length);
    } catch (error: any) {
      console.error("Error fetching chat users:", error);
      setChatError(error.message || "Failed to load chats.");
    } finally {
      setLoadingChats(false);
    }
  };

  // Function to fetch messages for the selected chat
  const fetchMessages = async (conversationId: string) => {
    if (!loggedInUser || loggedInUser.role !== 'admin') return;
    setLoadingMessages(true);
    try {
      const msgs = await chatService.getMessagesByConversationId(conversationId);
      // Ensure timestamps are correctly formatted for display if needed
      const mappedMsgs = msgs.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString(), // Convert to locale string for display
      }));
      setMessages(mappedMsgs);
      console.log(`Fetched messages for conversation ${conversationId}:`, msgs.length);
    } catch (error: any) {
      console.error(`Error fetching messages for ${conversationId}:`, error);
      setChatError(error.message || "Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initial fetch of chat users and setup of Socket.io listener for new chat notifications
  useEffect(() => {
    if (loggedInUser && loggedInUser.role === 'admin') {
      fetchChatUsers(); // Initial fetch

      // Socket.io for notifications (e.g., new guest chat or message in existing chat)
      socket.connect();
      const adminInboxRoom = 'admin_inbox';
      socket.emit('joinRoom', adminInboxRoom, loggedInUser._id);
      console.log(`FRONTEND ADMIN: Admin ${loggedInUser.name} (${loggedInUser._id}) joined admin inbox: ${adminInboxRoom}`);

      // Listener for new guest message notifications
      socket.on('newGuestMessageNotification', (data: { conversationId: string; guestId: string; guestName: string; preview: string; timestamp: string }) => {
        console.log("Socket: New guest message notification received:", data);
        fetchChatUsers(); // Re-fetch chats to update the list, especially if it's a new chat
        if (selectedChatUser && selectedChatUser._id === data.conversationId) {
            fetchMessages(data.conversationId); // Also fetch messages if it's the current chat
        }
      });

      // Listener for general message updates in active conversation (optional, for explicit updates)
      socket.on('messageUpdateNotification', (data: { conversationId: string; messageId: string }) => {
        console.log("Socket: Message update notification received for conversation:", data.conversationId);
        if (selectedChatUser && selectedChatUser._id === data.conversationId) {
          fetchMessages(data.conversationId); // Re-fetch messages for the active conversation
        }
      });


      return () => {
        socket.off('newGuestMessageNotification');
        socket.off('messageUpdateNotification');
        socket.disconnect();
      };
    } else if (loggedInUser && loggedInUser.role !== 'admin') {
      socket.disconnect();
      setChatError("Access Denied: Not an admin.");
    }
  }, [loggedInUser, selectedChatUser]); // Add selectedChatUser to dependencies for messageUpdateNotification

  // Effect to fetch messages when a new chat is selected
  useEffect(() => {
    if (selectedChatUser) {
      fetchMessages(selectedChatUser._id);
      // Reset unread count for selected chat (this would typically involve a backend call to mark as read)
      setChatUsers(prevUsers => prevUsers.map(user => 
          user._id === selectedChatUser._id ? { ...user, unreadCount: 0 } : user
      ));
    } else {
      setMessages([]); // Clear messages if no chat is selected
    }
  }, [selectedChatUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChatUser && loggedInUser && loggedInUser.role === 'admin') {
      try {
        const messagePayload = {
          conversationId: selectedChatUser._id, // Send to the conversation ID
          senderId: loggedInUser._id,
          senderName: loggedInUser.name,
          text: newMessage.trim(),
          isGuest: false, // Admin is not a guest
        };

        await chatService.sendMessage(messagePayload);
        setNewMessage('');
        // Messages will be fetched via the messageUpdateNotification from socket

        // Optimistically update the last message preview in the sidebar
        setChatUsers(prevUsers => prevUsers.map(user =>
          user._id === selectedChatUser._id ? {
            ...user,
            lastMessageText: newMessage.trim(),
            lastMessageTimestamp: new Date().toISOString(), // Use ISO string for consistency
          } : user
        ));

      } catch (error: any) {
        console.error("Error sending message:", error);
        setChatError(error.message || "Failed to send message.");
      }
    }
  };

  // Show loading/error states
  if (loadingChats) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <p className="text-gray-600">Loading chats...</p>
        </div>
    );
  }

  if (chatError) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <p className="text-red-700 font-bold">{chatError}</p>
      </div>
    );
  }

  // Ensure only admins can see this page after loading and error checks
  if (loggedInUser?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <p className="text-red-700 font-bold">Access Denied: You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased text-gray-800">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-4 bg-emerald-700 text-white font-bold text-xl rounded-tl-2xl">Active Chats</div>
        <div className="flex-grow overflow-y-auto">
          {chatUsers.length > 0 ? (
            chatUsers.map((user) => (
              <div
                key={user._id} // Use MongoDB _id as key
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200
                  ${selectedChatUser?._id === user._id ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedChatUser(user)}
              >
                <img
                  src={user.profilePic}
                  alt={user.guestName}
                  className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-emerald-300"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{user.guestName}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.lastMessageText}</p>
                </div>
                <div className="flex flex-col items-end text-xs text-gray-500">
                  <span>{new Date(user.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {user.unreadCount > 0 && ( // Unread count is a placeholder for now
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

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] md:h-[85vh] border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-emerald-700 text-white p-4 rounded-t-2xl shadow-md flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {selectedChatUser ? `Chat with ${selectedChatUser.guestName}` : 'Select a chat'}
            </h2>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading messages...
              </div>
            ) : selectedChatUser ? (
              messages.map((msg) => (
                <div
                  key={msg._id} // Use MongoDB _id as key
                  className={`flex ${msg.senderId === loggedInUser?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      msg.senderId === loggedInUser?._id
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
