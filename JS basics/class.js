class User{
    name;
    email;
    address;

    setName(_name)
    {this.name=_name}
    setEmail = function(_email)
    {this.email=_email}
    setAddress= (_address)=>
        {this.address=_address}

    getName= ()=> {
        return this.name
    }
}

//const userObj=new User()
//userObj.setName("Kebin Malla")
//userObj.setEmail("keninadod@gmail.com")
//userObj.setAddress("Kathmandu")
///let nems = userObj.getName()
///console.log(nems)

class EmailService{
    connectiom;

    constructor(){
        this.connection=""
    }

    sendEmail =()=>{
        
    }
}