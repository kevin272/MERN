const router = require('express').Router();


router.post('/login',(req,res,next)=>{
    const {userName,password}= req.body;
    res.status(200).json({
        result:{userName,password},
        message:"User login successfully",
        meta:null
    })
})


module.exports = router;