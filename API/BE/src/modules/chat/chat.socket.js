const initChatSocketHandlers = (io) => {
  console.log('Chat socket handlers initialized.');

  io.on('connection', (socket) => {
    console.log('A user connected to chat socket:', socket.id);

    socket.on('joinRoom', (roomName, userId) => {
      socket.join(roomName);
      console.log(`${userId} (Socket ID: ${socket.id}) joined room: ${roomName}`);
      socket.emit('roomJoined', { roomName, status: 'success' });
    });

    socket.on('chatMessage', (data) => {
      console.log(`Socket.io received 'chatMessage' from frontend. Sender: ${data.senderName}, Text: "${data.text}". Backend API will handle DB save.`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected from chat socket:', socket.id);
    });
  });
};

module.exports = initChatSocketHandlers;
