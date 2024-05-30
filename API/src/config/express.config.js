const express= require('express')
const app= express();

//app.get("url, optional", (req,res) => {})

app.post('/user',(req,res)=> {
    res.json(
       {
       result:null,
       message:"User created",
       meta: null
})})

app.get("/user",(req,res)=> {
     res.json(
        {
        result:null,
        message:`List all users`,
        meta: null
})})

app.get("/user/:id",(req,res)=> {
    res.json(
       {
       result:null,
       message:`USer Detail of ${req.params.id}`,
       meta: null
})})

app.put('/user/:id',(req,res)=> {
     res.json(
        {
        result:null,
        message:`User Update of ${req.params.id}`,
        meta: null
})})

app.delete('/user/:id',(req,res)=> {
    res.json(
       {
       result:null,
       message:`User Delete of ${req.params.id}`,
       meta: null
})})

app.get("/product/:slug",(req,res) => 
{
    const params = req.params;
    const query = req.query;

    res.json({
        result: {
            params: params,
            query: query
        },
        message: "Skibidi Bop Bop Bop",
        meta: null
    })
})

app.get("/about-us",(req,res)=> {
    const data =null;
     res.json(
        {
        result:"",
        message:"Abous us Fetched",
        meta: null
})})

app.get("/",(req,res)=> {

    const data =null;
     res.json(
        {
        result:data,
        message:"Myadi",
        meta: null
}
     )
    //res.render("")
//     res.status(204).json({
//                 result:data,
//                  message:"Myadi",
//                meta: null
//             })
})

module.exports = app;