import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../config/chat.config'; // Import the socket configuration
import { v4 as uuidv4 } from 'uuid'; // For generating unique guest IDs

import chatService from '../../pages/chat/chat.service'; // Import the chat service for API calls

interface Message {
  _id: string; // MongoDB document ID
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string; // Stored as ISO string, converted to readable string for display
  isGuest?: boolean;
}

export const GuestChatPage: React.FC = () => {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Effect to generate/load guest ID and name
  useEffect(() => {
    let storedGuestId = localStorage.getItem('guestId');
    let storedGuestName = localStorage.getItem('guestName');

    if (!storedGuestId) {
      storedGuestId = uuidv4(); // Generate a unique ID for the guest session
      localStorage.setItem('guestId', storedGuestId);
    }
    setGuestId(storedGuestId);

    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameSet(true);
    }
  }, []);

  // Function to fetch messages for this guest's conversation
 const fetchGuestMessages = async (currentGuestId: string) => {
  setLoadingMessages(true);
  setChatError(null); // Clear previous errors
  try {
    const msgs = await chatService.getGuestMessagesByGuestId(currentGuestId);
    const mappedMsgs = msgs.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp).toLocaleString(),
    }));
    setMessages(mappedMsgs);
    console.log(`Fetched guest messages for conversation ${currentGuestId}:`, msgs.length);
  } catch (error: any) {
    console.error(`Error fetching guest messages for ${currentGuestId}:`, error);

    // Check if the error is a 404 specifically for "Conversation not found"
    if (error.response && error.response.status === 404 && error.response.data.message === 'Conversation not found for this guest.') {
      console.log('No existing conversation found, starting fresh chat.');
      setMessages([]); // Set messages to an empty array (empty chat history)
      setChatError(null); // Clear any error state, as this is a valid scenario
    } else {
      // For any other type of error (e.g., network issues, server errors), display a general error
      setChatError(error.message || "Failed to load guest messages.");
    }
  } finally {
    setLoadingMessages(false);
  }
};

  // Initial fetch of guest messages and Socket.io listener for updates
  useEffect(() => {
    if (guestId && isNameSet) {
      // Fetch initial messages for this guest
      fetchGuestMessages(guestId);

      // Socket.io for real-time message updates
      socket.connect();
      const roomName = `guest_${guestId}`;
      socket.emit('joinRoom', roomName, guestId); // Guest joins their unique room

      console.log(`FRONTEND GUEST CHAT: Guest ${guestName} (${guestId}) attempting to join room: ${roomName}`);

      // Listen for notification that a new message has been added to this conversation
      socket.on('messageUpdateNotification', (data: { conversationId: string }) => {
        console.log("Socket: Message update notification received for conversation:", data.conversationId);
        if (data.conversationId === guestId) { // Check if it's for this guest's chat
          fetchGuestMessages(guestId); // Re-fetch messages
        }
      });

      return () => {
        socket.off('messageUpdateNotification');
        socket.disconnect();
      };
    } else if (guestId && !isNameSet) {
      // If guestId exists but name isn't set, disconnect socket to avoid unnecessary connections
      socket.disconnect();
    }
  }, [guestId, isNameSet, guestName]);

  // Effect to scroll to the bottom of the messages list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSetGuestName = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      localStorage.setItem('guestName', guestName.trim());
      setIsNameSet(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && guestId && isNameSet) {
      try {
        const messagePayload = {
          guestId: guestId, // This is the conversation ID for guests
          guestName: guestName.trim(), // Send guest name for conversation creation/update
          senderId: guestId,
          senderName: guestName.trim(),
          text: newMessage.trim(),
          isGuest: true, // This message is from a guest
        };

        await chatService.sendMessage(messagePayload);
        setNewMessage('');
        // Messages will be refreshed by the 'messageUpdateNotification' from socket

      } catch (error: any) {
        console.error("Error sending message:", error);
        setChatError(error.message || "Failed to send message.");
      }
    }
  };

  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-600 to-green-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Enter Your Name to Start Chat</h2>
          <form onSubmit={handleSetGuestName} className="space-y-4">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your Name"
              className="block w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Start Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loadingMessages) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600">Loading messages...</p>
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans antialiased text-gray-800">
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col h-[80vh] md:h-[75vh] border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-emerald-700 text-white p-4 rounded-t-2xl shadow-md flex items-center justify-between">
            <h2 className="text-xl font-bold">Guest Chat ({guestName})</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id} // Use MongoDB _id as key
                className={`flex ${msg.senderId === guestId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                    msg.senderId === guestId
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
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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

export default GuestChatPage;
