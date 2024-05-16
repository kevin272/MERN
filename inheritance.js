class User {
    name="Ramesh";
    email;
    address;

    getUserName= () =>
        {return this.name}
}
class student extends User{role = 'student'}
class Admin extends User{
    phonel
    role = 'admin'
}

const std = new student()
const admin = new Admin()
console.log(admin.getUserName())