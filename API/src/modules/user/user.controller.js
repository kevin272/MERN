
class UserController{
    userCreate =((req, res) => {
        res.json({
            result: null,
            message: "User created",
            meta: null
        });})
    
    UserDetail =((req, res) => {
        res.json({
            result: null,
            message: "List all users",
            meta: null
        });
    });

    UserDetailByID = ((req, res) => {
        res.json({
            result: null,
            message: `User Detail of ${req.params.id}`,
            meta: null
        });
    })

    UserUpdateByID = ((req, res) => {
        res.json({
            result: null,
            message: `User Update of ${req.params.id}`,
            meta: null
        });
    })

    UserDeleteByID = ((req, res) => {
        res.json({
            result: null,
            message: `User Delete of ${req.params.id}`,
            meta: null
        });
    });



}

const userCtrl = new UserController()
module.exports = userCtrl;