//const foo =(a,b=0) => {
    const doubleValue = (x) =>
        {return (x*2)}
    return doubleValue;
    
//}
//const bar = () =>
 //   {result()}

//console.log(foo(36,45));

const foo = (cb) => 
    { 
        console.log("I am in foo")
        cb()
    }

const bar = () =>
    {
        console.log("I am in bar")
    }
foo=() => {
    //...
}
foo(bar)