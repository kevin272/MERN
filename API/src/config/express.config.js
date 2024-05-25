const express= request('express')
const app= express();

//request url route, API Endpoint
app.use((req,res)=>
{
    //req => Inoming data
    res.end("Hello World");
})

module.exports = app;