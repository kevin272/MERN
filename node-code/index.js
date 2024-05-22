const fs= require("node:fs/promises")

const users=[{
    name:"Kebin Malla",
    email:"keninadod@gmail.com",
    address:"Kathmandu"
},
{
    name:"Dbl",
    email:"ds@gmail.com",
    address:"Lalitpur"
}]

const file="./user.json"

const jsonStr = JSON.stringify(users)

//fs.open(file,"w",(err,fd)=>
//{if(err)
//    {console.log("File Cannot be opened")
//    }
//else{fs.write(fd,jsonStr,(error,bytesWritten,str) =>
//{
//    if (error) {
//        console.log("Error while writing file.",error)
///    }
//    else{
//        console.log("You have written:",bytesWritten)
//        fs.close(fd)
//    }
//})}
///}})
//fs.writeFile(file,jsonStr,(err)=>
//{
//    if (err){
  //      console.log("Error Writing")
    //}
    //else
    //{console.log("File write sucess")}
//})
fs.writeFile(file,jsonStr)
    .then((success)=>{
        console.log("File written successfully")
        console.log(success)
    })
    .catch((error)=>
    {
        console.log("Error while writing")
        console.log(error)
    })

fs.readFile(file,{encoding:"utf8"})
 .then((data)=>
{
    console.log("data",data)
    const jsontoObj=JSON.parse(data)
    console.log(jsontoObj)
})
 .catch((exception)=>
{console.log("cannot read,",exception)})