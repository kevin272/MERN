const express= require('express')
const router = require ("./router.config")

const app= express();
app.use(router)

app.use ((req,res,next) => 
{
    next({status:404,message: "Resource Not Found"})
})

app.use((error,req,res,next) => 
    {
        let statusCode = error.status || 500;
        let message = error.message || "Server Error";
        let detail = error.detail || null;

        res.status (statusCode).json(
            {
                result: detail,
                message: message,
                meta: null
            }
        )
    })

module.exports = app;