console.log("Hello World")
document.write("<h1>Hello World</h1>")
//debugger;
document.getElementById('first').innerHTML= 'Update value'
document.querySelector('#first').innerHTML='Query Selector'

//TRL
//setTimeout(()=>{console.log("one time caller")},1000);
//const interval = setInterval(()=>{console.log("inside interval")},1000);
//clearInterval(interval);
//clearTimeout();
setInterval(()=>{
    const today= new Date();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();

    document.getElementById('clock').innerHTML= hour+":"+minute+":"+second

},1000)

const increaseCounter=() => {
    counter++;
    document.querySelector("#counter").innerHtml= counter;
}

window.addEventListener('DOMContentLoaded',()=>
{
    const btn =document.querySelector("#counter");
    console.log(btn)
    document.on("click",(e)=>
    {console.log(e)})
})