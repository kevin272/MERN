let tax=0
const eng={
    name : "Manish",
    sal: 5000000
}

if (eng.sal<=500000)
{
    tax=eng.sal*.1}
    else if (eng.sal<=1000000){
    tax=500000*.1+eng.sal*.15}
    else if (eng.sal<=1700000)
        {
         tax=5000+75000+700000*.25}
            else  if(eng.sal<=2700000)
                {
                    tax=5000+75000+70000*.25+1000000*.3+(eng.sal-2700000)*.36
                }

console.log("Tax Amount")
console.log(tax)
console.log("Monthly Salary")
console.log((eng.sal-tax)/12)
console.log("Annual Salary")
console.log((eng.sal-tax))
