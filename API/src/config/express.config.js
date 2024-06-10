const express = require ('express');
const app = express();
var morgan = require('morgan')


// importing router config
const router = require('./router.config');



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
    
    res.status(statusCode).json({
        result:detail,
        message:message,
        meta:null
    });

});


// exporting express application
module.exports = app;