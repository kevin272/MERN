// create http server and mount the app
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const app = require('./src/config/express.config');
const server = http.createServer(app);

// middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to handle cookies across origins
    allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));


// assigning port values
const port = process.env.PORT || 9005;
server.listen(port, (error) => {
    if (error) {
        console.log('Error starting server');
    } else {
        console.log('Server started on http://localhost:'+port);
        console.log('Press Ctrl+C to stop');
    }
}
);