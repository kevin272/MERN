
//do{
//    console.log("Myadi")
 //   console.log(i++)
//}while(i<=10)
//while(i<=10){
//    console.log("Myadi")
 ///  console.log(i++)
//}

//for (i=1;i<=5;i++)
//{
//    let toprint=""
//    for(j=1;j<=i;j++)
//    {toprint+=j+" "}
//    console.log(toprint)
//}
//for (i=5;i>=1;i--)
//{
//    let toprint=""
//    for(j=1;j<=i;j++)
//    {toprint+=j+" "}
//    console.log(toprint)
//}
//let str=["P","R","O","G","R","A","M","M","I","N","G"]
//let str="PROGRAMMING"
//for (i=0;i<=10;i++)
//{
//    let toprint=""
//    for(j=0;j<=i;j++)
 //   {toprint+=str[j]+" "}
//    console.log(toprint)
//}
let i=1,j=1
for (i=1;i<=9;i++)
{
    if(i==1||i==6)
     {
        let tp=""    
        for(j=1;j<=5;j++)
            {
                tp+=i+" "
            }
        console.log(tp)
    }
    else if (i==2||i==3||i==4||i==5){
        let p=""    
        for(j=1;j<=5;j++)
            {if(j===1||j===5)
            {p=p+i+" "}
            else
            {p+="  "}}
            console.log(p)
        }
        else{
           console.log(i)}
}
    