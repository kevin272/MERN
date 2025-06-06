const express = require ('express');
const app = express();
var morgan = require('morgan')


// import database connection
require('./db.config');

// importing router config
const router = require('./router.config');
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to handle cookies across origins
    allowedHeaders: 'Content-Type, Authorization',
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.static('uploads'));


// router mounting point
app.use(router)


// 404 middleware
app.use((req, res, next) => {
   next({
       statusCode: 404,
       message: `Resource not found`,
       detail: null
    });
});

// error handling middleware
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let detail= err.detail || null;


    //handling mongoose validation error
    if (err.code === 11000) {
        const uniqueFieldKeys = Object.keys(err.keyPattern);  // ['email','phone'] throws array of unique failed keys
        console.log(uniqueFieldKeys);
        detail= {};
        detail[uniqueFieldKeys]=uniqueFieldKeys.map(key => `${key} must be unique`).join(','); 
       message='Validation Error';
       statusCode = 400;
        
    }




    res.status(statusCode).json({
        result:detail,
        message:message,
        meta:null
    });

});




// exporting express application
module.exports = app;