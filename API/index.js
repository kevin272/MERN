const http=require("http")

const server= http.createServer((req,res)=>
{res.end("Hello World")})

server.listen(9005,'127.0.0.1',(error)=>
{
    if(error){console.log("Server Error")    }
    else{console.log("Server is running on port: 9005")
        console.log("Press Ctrl+C to discontinue the server.")
    }
})