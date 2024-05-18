class User{
    name;
    constructor()
    {console.log("User Class");}
}
class Admin extends User{
    constructor(){
        super()
            console.log("Admin class")
    }
    
    setName= () =>
        {
            this.name="Kebin"
        }
}
const adminObj=new Admin();
