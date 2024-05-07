const foo =(a,b=0) => {
    const doubleValue = (x) =>
        {return (x*2)}
    return doubleValue(a+b);
}
const result =foo(10)
console.log(result);