//setTimeout(()=>{
//console.log("1")},3000)
//setTimeout(()=>{
//    console.log("2")},2000)
//    setTimeout(()=>{
 //       console.log("3")},1000)

const myPromise = new Promise ((resolve,reject) => 
{
    const success = false;
    if (success){resolve("Resolve")}
    else {reject ("Reject")}
})
myPromise
   .then((success)=> {console.log(success)})
   .catch((exception)=> {console.log(exception)})
console.log("I am first line")