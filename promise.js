const func1= ()=>
    { 
        return new Promise((res,rej)=>
        {const x=false
            if (x)
                {res ("resolve 1")}
            else {rej("reject 1")}
        })
    }

    const func2=()=>
        {
            return new Promise((res,rej)=>
            {const x=true
                if (x)
                    {res ("resolve 2")}
                else {rej("reject 2")}
            })
        }
        const func3=()=>
            {
                return new Promise((res,rej)=>
                {const x=false
                    if (x)
                        {res ("resolve 3")}
                    else {rej("reject 3")}
                })
            }

//func1()
//.then((suc)=>
//{console.log(suc)})
//.catch((error)=>
//{console.log(error)})

//func2()
//.then((suc)=>
//{console.log(suc)})
//.catch((error)=>
//{console.log(error)})

//func3()
//.then((suc)=>
//{console.log(suc)})
//.catch((error)=>
//{console.log(error)})

//const all = Promise.allSettled([func1(),func2(),func3()]) 
//all .then ((res)=>{console.log(res)})
//.catch((rej)=> {console.log(rej)})
//.finally(()=>
//{console.log("always execute"
//    //loading = false
//)})

const resolveData = async() =>
    {
        let x = true;
        if (x) {return "I am resolved"}
        else{"I am reject"}

    }
async function handleAsync() {
    try {
        const result = await resolveData()
        console.log(result)
    }
    catch(exception){console.log(exception)}
}
handleAsync()