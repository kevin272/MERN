let fullName :string  = "sandesh";
type UserRole="admin"|"seller"|"customer"

interface UserObj{
    name:string,
    email:string,
    role:string,
    phone?:string
}
let user: UserObj ={
    name: "Sandesh",
    email:"123@gmail.com",
    role:"admin"
}
console.log(fullName)