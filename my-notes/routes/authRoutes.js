const express = require("express")
const router = express.Router();
const User = require("../models/user");
const passport=require("passport");

//Sign route
router.get("/signup", (req,res)=>{
    res.render('farmerRegistration');
})
router.post("/signup", async(req, res)=>{
    try{
        const user = new User(req.body);
        let existingUser = await User.findOne({farmerEmail:req.body.farmerEmail});
        if(existingUser){
            return res.status(400).send('Not registered, the user already exists')
        }else{
            await User.register(user, req.body.farmerPassword,(err)=>{
                if (err){
                    throw err;  
                }
                res.redirect("/login")
            });
        }
    }catch (error){
        res.status(400).send('Sorry, something went wrong');
    }
});

//Login route
router.get("/login", (req,res)=>{
    res.render('login');
});

router.post("/login", passport.authenticate("local",{failureRedirect:"/login"}), (req,res)=>{
req.session.user = req.user;
if (req.user.role=='farmer'){
    res.send('This is the farmer dashboard')
}else if(req.user.role=='salesRep'){
    res.render('salesDashboard')
} else if(req.user.role =='brooderManager'){
    res.send('This is the manager dashboard')
}else{
    res.send('User doesnt exist')
}})

//logout button
router.get('/logout', (req,res)=>{
    if(req.session){
        req.session.destroy((error)=>{
            if(error){
                return res.status(500).send('error logging out')
            }
            res.redirect('/')
        })
    }
})

module.exports = router;