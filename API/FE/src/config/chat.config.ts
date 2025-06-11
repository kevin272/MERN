import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL ="http://localhost:9005";

export const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('FRONTEND SOCKET: Connected to server with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('FRONTEND SOCKET: Disconnected from server. Reason:', reason);
});

socket.on('connect_error', (error) => {
  console.error('FRONTEND SOCKET: Connection error:', error.message);
});
