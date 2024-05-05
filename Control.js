
//const product = {
//    name : "Product name",
 //   price: 1000,
  //  discount: 10,
  //  isPercent: false
//}
//if (product.isPercent=== true){
//    var afterdiscount=product.price-product.price*productdiscount*100;
//}
//else
//console.log(afterdiscount)

var day="Wednesday"
//if (day==="Sunday")
//{
 //   console.log("Holiday")
//}
///else if (day==="Friday")
//{console.log("Weekend")}
//else {console.log("Weekday")}
switch (day)
{
    case "Sunday":
    case "Saturday":
        console.log("Holiday")
        break
    case "Friday":
        console.log("Weekend")
    default:
        console.log("Weekday")
}