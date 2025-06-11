
let ioInstance = null; // Private variable to hold the Socket.io server instance

const initializeSocketIO = (httpServer, corsOptions) => {
  if (!ioInstance) {
    const { Server } = require("socket.io");
    ioInstance = new Server(httpServer, {
      cors: corsOptions // Use the CORS options passed from index.js
    });
    console.log("Socket.io: Server initialized.");
  }
};

const getIo = () => {
  if (!ioInstance) {
    // This scenario should ideally not happen if initializeSocketIO is called first
    console.warn("Socket.io: Attempted to get IO instance before initialization.");
    throw new Error("Socket.io not initialized. Call initializeSocketIO first.");
  }
  return ioInstance;
};

module.exports = {
  initializeSocketIO,
  getIo
};
