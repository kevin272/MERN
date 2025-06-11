// create http server and mount the app
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const app = require('./src/config/express.config');
const server = http.createServer(app);

// Import Socket.io configuration and chat socket handlers
const { initializeSocketIO, getIo } = require('./src/config/socket.config'); // Assuming socket.config.js is in src/config
const initChatSocketHandlers = require('./src/modules/chat/chat.socket'); // Assuming chat.socket.js is in src/modules/chat

// middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to handle cookies across origins
    allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));


// Initialize Socket.io with the HTTP server and CORS options
initializeSocketIO(server, corsOptions); // Pass the HTTP server and corsOptions

// Get the initialized Socket.io instance and pass it to chat handlers
const io = getIo(); // Retrieve the Socket.io instance
initChatSocketHandlers(io); // Initialize chat socket listeners


// assigning port values
const port = process.env.PORT || 9005;
server.listen(port, (error) => {
    if (error) {
        console.log('Error starting server');
    } else {
        console.log('Server started on http://localhost:'+port);
        console.log('Press Ctrl+C to stop');
    }
});
