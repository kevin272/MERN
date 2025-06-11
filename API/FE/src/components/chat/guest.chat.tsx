import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../config/chat.config';
import { v4 as uuidv4 } from 'uuid';
import chatService from '../../pages/chat/chat.service';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
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

  useEffect(() => {
    let storedGuestId = localStorage.getItem('guestId');
    let storedGuestName = localStorage.getItem('guestName');

    if (!storedGuestId) {
      storedGuestId = uuidv4();
      localStorage.setItem('guestId', storedGuestId);
    }

    setGuestId(storedGuestId);

    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameSet(true);
    }
  }, []);

  const fetchGuestMessages = async (currentGuestId: string) => {
    setLoadingMessages(true);
    setChatError(null);
    try {
      const msgs = await chatService.getGuestMessagesByGuestId(currentGuestId);
      const mappedMsgs = msgs.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      }));
      setMessages(mappedMsgs);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.message === 'Conversation not found for this guest.'
      ) {
        setMessages([]);
      } else {
        setChatError(error.message || 'Failed to load messages.');
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (guestId && isNameSet) {
      fetchGuestMessages(guestId);
      socket.connect();

      const roomName = `guest_${guestId}`;
      socket.emit('joinRoom', roomName, guestId);

      const handleSocketUpdate = (data: { conversationId: string }) => {
        if (data.conversationId === guestId) {
          fetchGuestMessages(guestId);
        }
      };

      socket.on('messageUpdateNotification', handleSocketUpdate);

      return () => {
        socket.off('messageUpdateNotification', handleSocketUpdate);
        socket.disconnect();
      };
    }
  }, [guestId, isNameSet]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          guestId,
          guestName: guestName.trim(),
          senderId: guestId,
          senderName: guestName.trim(),
          text: newMessage.trim(),
          isGuest: true,
        };

        await chatService.sendMessage(messagePayload);
        setNewMessage('');

        setMessages(prev => [
          ...prev,
          {
            _id: `temp-${Date.now()}`,
            senderId: guestId,
            senderName: guestName.trim(),
            text: messagePayload.text,
            timestamp: new Date().toLocaleString(),
            isGuest: true,
          },
        ]);
      } catch (error: any) {
        setChatError(error.message || 'Failed to send message.');
      }
    }
  };

  // Loading or error state
  if (!isNameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-800 via-emerald-600 to-green-400 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-800">Enter Your Name</h2>
          <form onSubmit={handleSetGuestName} className="space-y-4">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition duration-200"
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
        <span className="text-gray-600">Loading messages...</span>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <span className="text-red-600 font-semibold">{chatError}</span>
      </div>
    );
  }

  // Main chat UI
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[80vh] md:h-[75vh] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <header className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h1 className="text-lg font-semibold">Guest Chat ({guestName})</h1>
          </header>

          <main className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.senderId === guestId ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-xl px-4 py-2 text-sm max-w-[70%] shadow-md ${
                    msg.senderId === guestId
                      ? 'bg-emerald-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p><strong>{msg.senderName}:</strong> {msg.text}</p>
                  <span className="block text-right text-xs opacity-60 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </main>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-lg shadow transition-all duration-200"
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
